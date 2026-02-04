#!/usr/bin/env node
/**
 * scripts/convert-library-to-json.js (CommonJS)
 *
 * Uso:
 *   node scripts/convert-library-to-json.js <ruta/de/library.js> <ruta/salida/templates.json>
 *
 * Ejemplo:
 *   node scripts/convert-library-to-json.js ../arch-extension2/src/core/library.js packages/arch-sdk/src/templates.json
 *
 * Nota:
 *  - Este script evalúa el literal del objeto extraído. Si hay expresiones JS complejas
 *    dentro de backticks (${...}), la evaluación puede fallar.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function usageAndExit() {
  console.error("Uso: node scripts/convert-library-to-json.js <input/library.js> <output/templates.json>");
  process.exit(2);
}

const args = process.argv.slice(2);
if (args.length < 2) usageAndExit();

const inputPath = path.resolve(process.cwd(), args[0]);
const outputPath = path.resolve(process.cwd(), args[1]);

if (!fs.existsSync(inputPath)) {
  console.error("Archivo de entrada no encontrado:", inputPath);
  process.exit(1);
}

const src = fs.readFileSync(inputPath, "utf-8");
const marker = "window.ARCH_LIBRARY";
const idx = src.indexOf(marker);
if (idx === -1) {
  console.error(`No se encontró "${marker}" en ${inputPath}`);
  process.exit(1);
}

const eqIdx = src.indexOf("=", idx);
if (eqIdx === -1) {
  console.error("No se encontró '=' tras el marker");
  process.exit(1);
}
const braceStart = src.indexOf("{", eqIdx);
if (braceStart === -1) {
  console.error("No se encontró '{' que inicie el objeto");
  process.exit(1);
}

// Extraer literal del objeto balanceando llaves, cuidando strings y escapes
let i = braceStart;
let depth = 0;
let inSingle = false;
let inDouble = false;
let inBacktick = false;
let escaped = false;
let objText = "";
for (; i < src.length; i++) {
  const ch = src[i];
  objText += ch;

  if (escaped) {
    escaped = false;
    continue;
  }

  if (ch === "\\\\") {
    escaped = true;
    continue;
  }

  if (inSingle) {
    if (ch === "'") inSingle = false;
    continue;
  }
  if (inDouble) {
    if (ch === '"') inDouble = false;
    continue;
  }
  if (inBacktick) {
    if (ch === "`") inBacktick = false;
    continue;
  }

  if (ch === "'") { inSingle = true; continue; }
  if (ch === '"') { inDouble = true; continue; }
  if (ch === "`") { inBacktick = true; continue; }

  if (ch === "{") { depth += 1; continue; }
  if (ch === "}") {
    depth -= 1;
    if (depth === 0) {
      break;
    }
  }
}

if (depth !== 0) {
  console.error("Error: no se pudo balancear llaves. El archivo puede contener sintaxis compleja.");
  process.exit(1);
}

const toEval = "(" + objText + ")";

let parsed;
try {
  const context = vm.createContext(Object.create(null));
  parsed = vm.runInContext(toEval, context, { timeout: 2000 });
} catch (err) {
  console.error("Error evaluando el literal del objeto:", err.message || err);
  console.error("Si el archivo usa expresiones dentro de backticks (${...}) que referencian variables externas, la evaluación fallará.");
  process.exit(1);
}

try {
  const json = JSON.stringify(parsed, null, 2);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, json, "utf-8");
  console.log("Convertido con éxito:", outputPath);
} catch (err) {
  console.error("Error serializando/escribiendo JSON:", err);
  process.exit(1);
}