// packages/arch-sdk/src/index.js
const path = require('path');
const fs = require('fs');

let templates = null;

function loadTemplatesSync() {
  if (templates) return templates;
  // Busca el templates.json en la misma carpeta que este archivo
  const jsonPath = path.join(__dirname, 'templates.json');
  
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`templates.json no encontrado en ${jsonPath}. Genera el archivo con el script de conversión.`);
  }
  
  templates = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  return templates;
}

async function getTemplates() {
  return loadTemplatesSync();
}

/**
 * Reemplazos simples:
 * - {{INPUT}} -> vars.input
 * - {{VAR:Name:Option1,Option2}} -> vars.Name if present, otherwise first option
 */
function renderTemplate(templateKey, vars = {}) {
  const tpls = loadTemplatesSync();
  const raw = tpls[templateKey];
  
  if (!raw) throw new Error(`Template not found: ${templateKey}`);

  let out = String(raw);

  // Replace {{INPUT}}
  if (vars.input !== undefined) {
    out = out.split('{{INPUT}}').join(String(vars.input));
  }

  // Replace {{VAR:Name:Option1,Option2}}
  out = out.replace(/\{\{VAR:([^:}]+):([^}]+)\}\}/g, (_m, name, opts) => {
    if (Object.prototype.hasOwnProperty.call(vars, name)) {
      return String(vars[name]);
    }
    const first = String(opts).split(',')[0].trim();
    return first || '';
  });

  return out;
}

async function analyzeWithTemplate(templateKey, vars = {}) {
  // Aquí llamamos a tu función de renderizado
  try {
    const prompt = renderTemplate(templateKey, vars);
    return {
      success: true,
      templateKey,
      prompt, // Aquí va el texto final procesado
      metadata: { producedAt: new Date().toISOString() }
    };
  } catch (err) {
    return {
        success: false,
        error: err.message
    };
  }
}

module.exports = { getTemplates, renderTemplate, analyzeWithTemplate };