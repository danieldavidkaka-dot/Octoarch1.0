import { cancel, intro, isCancel, outro, text, select } from "@clack/prompts";
import type { RuntimeEnv } from "../runtime.js";
import { stylePromptMessage, stylePromptTitle } from "../terminal/prompt-style.js";
import { createRequire } from 'module';

// CONFIGURACIÓN DE CARGA
const require = createRequire(import.meta.url);

// 1. Importamos el conector (Lógica)
const { runArchAnalysis } = require('../plugins/archConnector.cjs');

// 2. Importamos los templates (Datos) para armar el menú
// Usamos try/catch por si la ruta varía, para que no explote
let templateKeys: string[] = ["DEV", "DOC_GEN"]; // Fallback por defecto
try {
  const templates = require('../../packages/arch-sdk/src/templates.json');
  templateKeys = Object.keys(templates);
} catch (e) {
  console.error("Warning: Could not load templates.json list", e);
}

export type ArchOptions = {
  template?: string;
  input?: string;
};

export async function archCommand(runtime: RuntimeEnv, opts: ArchOptions) {
  intro(stylePromptTitle("Arch Analysis Tool") ?? "Arch Analysis");

  // --- 1. SELECCIÓN DEL TEMPLATE (DINÁMICA) ---
  let templateKey = opts.template;
  
  if (!templateKey) {
    // Convertimos la lista de keys en el formato que pide el menú
    const menuOptions = templateKeys.map(key => ({
      value: key,
      label: key,
      hint: "Arch Template" 
    }));

    const selection = await select({
      message: stylePromptMessage(`Select analysis template (${menuOptions.length} available)`),
      options: menuOptions,
      // Si son muchos, esto permite scrollear con las flechas
      maxItems: 10 
    });

    if (isCancel(selection)) {
      cancel("Operation cancelled.");
      runtime.exit(0);
      return;
    }
    templateKey = selection as string;
  }

  // --- 2. TEXTO DE ENTRADA ---
  let inputText = opts.input;
  if (!inputText) {
    const input = await text({
      message: stylePromptMessage("Enter text to analyze"),
      placeholder: "Paste your code or question here...",
    });

    if (isCancel(input)) {
      cancel("Operation cancelled.");
      runtime.exit(0);
      return;
    }
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