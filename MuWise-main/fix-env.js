// fix-env.js
import fs from "fs";

// 1. Lee tu archivo serviceAccount.json
const serviceAccount = JSON.parse(
  fs.readFileSync("./new-prototype-rmkd6-firebase-adminsdk-fbsvc-f17e4e3695.json", "utf8")
);

// 2. Convierte el objeto de la cuenta de servicio a un string JSON
const serviceAccountJsonString = JSON.stringify(serviceAccount);

// 3. Carga el contenido actual del .env.local (si existe)
let envContent = "";
const envPath = "./.env.local";
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
}

// 4. Reemplaza o añade la variable
function upsertEnv(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, "m");
  const newEntry = `${key}='${value}'`; // Encierra el JSON en comillas simples
  if (regex.test(content)) {
    return content.replace(regex, newEntry);
  } else {
    // Asegurarse de que haya un salto de línea si el archivo no está vacío
    const separator = content.trim() === '' ? '' : '\n';
    return content + separator + newEntry;
  }
}

envContent = upsertEnv(envContent, "FIREBASE_SERVICE_ACCOUNT_KEY", serviceAccountJsonString);

// 5. Guarda el archivo corregido
fs.writeFileSync(envPath, envContent, "utf8");

console.log("✅ .env.local actualizado correctamente con FIREBASE_SERVICE_ACCOUNT_KEY.");
