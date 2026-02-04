// src/cli/arch-run.cjs
const { runArchAnalysis } = require('../plugins/archConnector.cjs');

async function main() {
  // Obtener argumentos simples de la terminal
  const args = process.argv.slice(2);
  // Ejemplo de uso: node script.js DEV "texto input"
  const template = args[0] || 'DEV'; 
  const input = args[1] || 'Prueba de integración exitosa';

  console.log("--- Iniciando prueba de Arch en OpenClaw ---");
  
  try {
    const res = await runArchAnalysis(template, input);
    console.log("\n>>> RESULTADO GENERADO (Simulado):\n");
    console.log(JSON.stringify(res, null, 2));
    console.log("\n>>> ÉXITO: El sistema de templates funciona.");
  } catch (err) {
    console.error(">>> ERROR:", err.message);
  }
}

main();