import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("🔍 Analizando tu API Key...");

if (!apiKey) {
    console.error("❌ ERROR: No se encontró GEMINI_API_KEY en el archivo .env");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function check() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Google rechazó la conexión:");
            console.error(data.error);
        } else if (data.models) {
            console.log("\n✅ CONEXIÓN EXITOSA. Modelos disponibles para ti:");
            console.log("==============================================");
            
            // Filtramos solo los que son "generateContent" y "Gemini"
            const geminis = data.models.filter(m => 
                m.name.includes("gemini") && m.supportedGenerationMethods.includes("generateContent")
            );

            if (geminis.length === 0) {
                console.log("⚠️ No se encontraron modelos Gemini. Lista cruda:", data.models);
            } else {
                geminis.forEach(m => {
                    // Limpiamos el nombre para que sea fácil de copiar
                    const cleanName = m.name.replace("models/", "");
                    console.log(`🔹 ${cleanName}`);
                });
            }
            console.log("==============================================");
            console.log("👉 COPIA uno de estos nombres exactos.");
        }
    } catch (e) {
        console.error("❌ Error de red:", e);
    }
}

check();