// setup-env.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const envFilePath = path.join(__dirname, '.env.local');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateSecret() {
  return crypto.randomBytes(32).toString('hex');
}

function createEnvFile() {
  console.log('📄 No se encontró el archivo .env.local. Creando uno nuevo...');
  
  const jwtSecret = generateSecret();
  const resendApiKey = 'REPLACE_WITH_YOUR_RESEND_API_KEY'; // Placeholder for user
  
  const envContent = `
# Clave secreta para firmar los JSON Web Tokens (JWT) de los enlaces de firma.
# Esta clave ha sido generada automáticamente y de forma segura para ti.
JWT_SECRET="${jwtSecret}"

# Clave de API para el servicio de envío de correos (Resend).
# Reemplaza el valor con tu clave real de Resend.
RESEND_API_KEY="${resendApiKey}"

# Remitente de correo por defecto.
# Puedes usar 'onboarding@resend.dev' para pruebas.
EMAIL_FROM="Muwise <onboarding@resend.dev>"

# URL base de tu aplicación (importante para generar enlaces).
# Para desarrollo local, suele ser http://localhost:3000.
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# ¡No compartas este archivo ni lo subas a un repositorio de código!
`;

  fs.writeFileSync(envFilePath, envContent.trim());
  console.log('✅ ¡Éxito! El archivo .env.local ha sido creado con una JWT_SECRET segura.');
  console.log('\n🚨 ACCIÓN REQUERIDA:');
  console.log(`   1. Abre el nuevo archivo .env.local.`);
  console.log(`   2. Reemplaza "REPLACE_WITH_YOUR_RESEND_API_KEY" con tu clave de API real de Resend.`);
  console.log('   3. Guarda el archivo y reinicia tu servidor de desarrollo (`npm run dev`).\n');
  rl.close();
}

function checkEnvFile() {
  if (fs.existsSync(envFilePath)) {
    console.log('✅ El archivo .env.local ya existe.');
    const content = fs.readFileSync(envFilePath, 'utf-8');
    if (content.includes('JWT_SECRET')) {
      console.log('👍 La variable JWT_SECRET ya está configurada.');
      rl.close();
    } else {
      console.log('🔧 La variable JWT_SECRET no se encuentra. Añadiéndola...');
      const newSecret = generateSecret();
      const newContent = `\n\n# Clave secreta generada automáticamente para JWT\nJWT_SECRET="${newSecret}"\n`;
      fs.appendFileSync(envFilePath, newContent);
      console.log('✅ JWT_SECRET ha sido añadida a tu archivo .env.local.');
      console.log('\n Reinicia tu servidor de desarrollo para aplicar los cambios.\n');
      rl.close();
    }
  } else {
    createEnvFile();
  }
}

checkEnvFile();
