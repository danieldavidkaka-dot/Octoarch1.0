import { cancel, intro, isCancel, outro, text, select, spinner } from "@clack/prompts";
import type { RuntimeEnv } from "../runtime.js";
import { stylePromptMessage, stylePromptTitle } from "../terminal/prompt-style.js";
import { createRequire } from 'module';
import fs from 'node:fs/promises'; 
import path from 'node:path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Cargar variables de entorno del archivo .env al inicio
dotenv.config();

// CONFIGURACIÓN DE CARGA
const require = createRequire(import.meta.url);
const { runArchAnalysis } = require('../plugins/archConnector.cjs');

// Carga de Templates de forma dinámica
let templateKeys: string[] = ["DEV", "DOC_GEN"];
try {
  const templates = require('../../packages/arch-sdk/src/templates.json');
  templateKeys = Object.keys(templates);
} catch (e) {
  console.error("Warning: Could not load templates.json list", e);
}

// Definimos las opciones que acepta el comando
export type ArchOptions = {
  template?: string;
  input?: string;
  file?: string;
  apply?: boolean; // <--- OPCIÓN NUEVA AGREGADA
};

// Función auxiliar para limpiar el JSON (quita bloques de markdown ```json)
function cleanJsonResponse(text: string): string {
  return text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
}

export async function archCommand(runtime: RuntimeEnv, opts: ArchOptions) {
  intro(stylePromptTitle("Arch Analysis Tool") ?? "Arch Analysis");

  // --- 1. SELECCIÓN DEL TEMPLATE ---
  let templateKey = opts.template;
  if (!templateKey) {
    const menuOptions = templateKeys.map(key => ({
      value: key,
      label: key,
      hint: "Arch Template" 
    }));

    const selection = await select({
      message: stylePromptMessage(`Select analysis template (${menuOptions.length} available)`),
      options: menuOptions,
      maxItems: 10 
    });

    if (isCancel(selection)) { cancel("Cancelled."); runtime.exit(0); return; }
    templateKey = selection as string;
  }

  // --- 2. OBTENCIÓN DEL CONTENIDO (Input o Archivo) ---
  let inputText = opts.input;

  // Si no hay texto directo, revisamos si el usuario pasó un archivo
  if (!inputText && opts.file) {
    try {
      const filePath = path.resolve(process.cwd(), opts.file);
      runtime.log(`📄 Reading file: ${filePath}`);
      inputText = await fs.readFile(filePath, 'utf-8');
    } catch (err: any) {
      runtime.error(`Error reading file: ${err.message}`);
      runtime.exit(1);
      return;
    }
  }

  // Si no hay ni input manual ni archivo, preguntamos interactivamente
  if (!inputText) {
    const input = await text({
      message: stylePromptMessage("Enter text to analyze"),
      placeholder: "Paste code or description...",
    });

    if (isCancel(input)) { cancel("Cancelled."); runtime.exit(0); return; }
    inputText = input as string;
  }

  // --- 3. GENERACIÓN DEL PROMPT (Local) ---
  const s = spinner();
  s.start(`Generating prompt with template: ${templateKey}...`);
  
  let finalPrompt = "";
  try {
    const result = await runArchAnalysis(templateKey, inputText);
    
    if (result.success) {
      finalPrompt = result.prompt;
      s.stop("Prompt generated successfully.");
    } else {
      s.stop("Error generating prompt.");
      runtime.error(`Error: ${result.error}`);
      return;
    }
  } catch (err) {
    s.stop("Unexpected error.");
    runtime.error(`Unexpected error: ${err}`);
    return;
  }

  // --- 4. CONEXIÓN CON GEMINI (AUTOMATIZADA) ---
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // FALLBACK: Si no hay clave, mostramos el prompt
    runtime.log("\n⚠️  No GEMINI_API_KEY found in .env file.");
    runtime.log("Mostrando solo el prompt generado:\n");
    console.log(finalPrompt);
  } else {
    // Si hay clave, enviamos a Gemini
    s.start("🚀 Sending to Gemini (Thinking)...");
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Usamos el modelo validado
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const result = await model.generateContent(finalPrompt);
      const response = await result.response;
      const textResponse = response.text();

      s.stop("Gemini Response Received!");

      runtime.log("\n" + "=".repeat(50));
      runtime.log(`🤖 GEMINI (${templateKey}) SAYS:`);
      runtime.log("=".repeat(50));
      
      console.log(textResponse); 
      
      runtime.log("=".repeat(50) + "\n");

      // --- 5. LÓGICA DE APLICACIÓN (AUTO-APPLY) ---
      if (opts.apply) {
        runtime.log("⚡ Auto-Apply enabled. Parsing and writing files...");
        try {
          // Limpiamos el JSON de posibles bloques markdown
          const jsonStr = cleanJsonResponse(textResponse);
          const data = JSON.parse(jsonStr);

          // Verificamos que tenga la estructura correcta
          if (data.files && Array.isArray(data.files)) {
            runtime.log(`📂 Found ${data.files.length} files to create/update.`);
            
            for (const file of data.files) {
              // Resolvemos la ruta relativa a donde estás ejecutando el comando
              const targetPath = path.resolve(process.cwd(), file.path);
              const dir = path.dirname(targetPath);

              // 1. Crear directorios recursivamente si no existen
              await fs.mkdir(dir, { recursive: true });
              // 2. Escribir el archivo
              await fs.writeFile(targetPath, file.content);
              
              runtime.log(`   ✅ Wrote: ${file.path}`);
            }
            runtime.log("\n✨ All files processed successfully!");
          } else {
            runtime.log("⚠️  Could not find 'files' array in the JSON response. Nothing to apply.");
          }

        } catch (parseError) {
          runtime.error("❌ Failed to parse JSON or write files. The AI response might not be valid JSON.");
          // console.error(parseError); // Descomentar para debug
        }
      }

    } catch (apiError: any) {
      s.stop("Gemini API Error.");
      runtime.error(`Failed to connect to Gemini: ${apiError.message}`);
      // Fallback por si falla la red
      runtime.log("\nFallback prompt:");
      console.log(finalPrompt);
    }
  }

  outro("Process finished.");
}