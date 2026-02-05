import { cancel, intro, isCancel, outro, text, select } from "@clack/prompts";
import type { RuntimeEnv } from "../runtime.js";
import { stylePromptMessage, stylePromptTitle } from "../terminal/prompt-style.js";
import { createRequire } from 'module';
import fs from 'node:fs/promises'; // <--- IMPORTANTE: Para leer archivos
import path from 'node:path';      // <--- IMPORTANTE: Para rutas

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
  file?: string; // <--- NUEVO: Opción de archivo
};

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

  // NUEVO BLOQUE: Si no hay texto directo, revisamos si el usuario pasó un archivo
  if (!inputText && opts.file) {
    try {
      // Resolvemos la ruta absoluta del archivo para evitar errores
      const filePath = path.resolve(process.cwd(), opts.file);
      runtime.log(`📄 Reading file: ${filePath}`);
      
      // Leemos el contenido del archivo
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

  // --- 3. EJECUCIÓN ---
  runtime.log(`Analyzing with template: ${templateKey}...`);
  
  try {
    const result = await runArchAnalysis(templateKey, inputText);
    
    if (result.success) {
      runtime.log("\n" + "=".repeat(40));
      runtime.log(`✅ RESULTADO (${templateKey}):`);
      runtime.log("=".repeat(40));
      runtime.log(result.prompt); 
      runtime.log("=".repeat(40) + "\n");
    } else {
      runtime.error(`Error: ${result.error}`);
    }
  } catch (err) {
    runtime.error(`Unexpected error: ${err}`);
  }

  outro("Analysis complete.");
}