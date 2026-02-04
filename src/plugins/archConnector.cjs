// src/plugins/archConnector.cjs
const path = require('path');

let sdk;
try {
  // Intenta cargar como paquete instalado
  sdk = require('@arch/arch-sdk');
} catch (err) {
  try {
    // FALLBACK: Carga directa desde la carpeta packages si no está instalado
    // Ajustamos la ruta: ../../ baja de src/plugins/ a la raíz
    sdk = require('../../packages/arch-sdk/src/index.js');
  } catch (e) {
    throw new Error("No se pudo cargar @arch/arch-sdk. Asegúrate de que packages/arch-sdk existe.");
  }
}

async function runArchAnalysis(templateKey, inputText) {
  console.log(`[ArchConnector] Usando template: ${templateKey}`);
  const res = await sdk.analyzeWithTemplate(templateKey, { input: inputText });
  return res;
}

module.exports = { runArchAnalysis };