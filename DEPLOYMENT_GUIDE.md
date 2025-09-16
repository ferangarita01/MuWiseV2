# 🚀 Guía de Despliegue - MuWise V2

## 📋 Prerrequisitos

1. **Cuenta de Vercel** - [vercel.com](https://vercel.com)
2. **Cuenta de Firebase** - [firebase.google.com](https://firebase.google.com)
3. **Cuenta de Supabase** (opcional) - [supabase.com](https://supabase.com)
4. **Cuenta de Resend** (para emails) - [resend.com](https://resend.com)
5. **Cuenta de Stripe** (para pagos) - [stripe.com](https://stripe.com)

## 🔧 Configuración de Variables de Entorno

### En Vercel Dashboard:

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

#### Firebase (Producción)
```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_de_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
FIREBASE_PROJECT_ID=tu_proyecto_id
FIREBASE_CLIENT_EMAIL=tu_service_account_email
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\ntu_private_key_aqui\n-----END PRIVATE KEY-----\n
```

#### Supabase (Opcional - para migración)
```
NEXT_PUBLIC_SUPABASE_URL=https://tu_proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
USE_SUPABASE=false
```

#### Email (Resend)
```
RESEND_API_KEY=tu_resend_api_key
EMAIL_FROM=noreply@tudominio.com
```

#### Stripe (Pagos)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_stripe_key
STRIPE_SECRET_KEY=sk_live_tu_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
```

#### URLs y Configuración
```
NEXT_PUBLIC_BASE_URL=https://tudominio.com
GOOGLE_GENAI_API_KEY=tu_google_ai_key
NODE_ENV=production
```

## 🚀 Pasos de Despliegue

### 1. Conectar Repositorio
```bash
# En Vercel Dashboard:
# 1. Click "New Project"
# 2. Import from GitHub
# 3. Selecciona tu repositorio MuWiseV2
# 4. Configura el Root Directory como "." (raíz)
```

### 2. Configurar Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 3. Configurar Dominio Personalizado
```bash
# En Vercel Dashboard:
# 1. Ve a Settings → Domains
# 2. Agrega tu dominio personalizado
# 3. Configura los registros DNS según las instrucciones
```

## 🔍 Solución de Problemas

### Error 404: NOT_FOUND

**Causa:** Vercel no puede encontrar los archivos del proyecto.

**Soluciones:**

1. **Verificar Root Directory:**
   - En Vercel Dashboard → Settings → General
   - Asegúrate que "Root Directory" esté configurado como "." (punto)

2. **Verificar package.json:**
   ```bash
   # Asegúrate que package.json esté en la raíz del proyecto
   ls package.json
   ```

3. **Verificar next.config.mjs:**
   ```bash
   # Asegúrate que next.config.mjs esté en la raíz
   ls next.config.mjs
   ```

4. **Verificar estructura de src/app:**
   ```bash
   # Asegúrate que src/app/page.tsx exista
   ls src/app/page.tsx
   ```

### Error de Build

**Causa:** Errores de TypeScript o dependencias faltantes.

**Soluciones:**

1. **Verificar dependencias:**
   ```bash
   npm install
   ```

2. **Verificar TypeScript:**
   ```bash
   npm run build
   ```

3. **Verificar variables de entorno:**
   - Asegúrate que todas las variables estén configuradas en Vercel

### Error de Autenticación

**Causa:** Variables de entorno de Firebase/Supabase incorrectas.

**Soluciones:**

1. **Verificar Firebase:**
   - Ve a Firebase Console → Project Settings
   - Copia las configuraciones exactas

2. **Verificar Supabase:**
   - Ve a Supabase Dashboard → Settings → API
   - Copia las keys exactas

## 🧪 Testing Post-Despliegue

### 1. Verificar Página Principal
```bash
curl https://tudominio.com
# Debe retornar 200 OK
```

### 2. Verificar API Routes
```bash
curl https://tudominio.com/api/debug-env
# Debe retornar información de configuración
```

### 3. Verificar Autenticación
```bash
# Visita https://tudominio.com/auth/signin
# Debe cargar la página de login
```

## 🔄 Migración a Supabase (Opcional)

### 1. Configurar Supabase
```bash
# En Vercel Dashboard, cambia:
USE_SUPABASE=true
```

### 2. Ejecutar Migración
```bash
# POST a tu API de migración
curl -X POST https://tudominio.com/api/migrate-unified \
  -H "Content-Type: application/json" \
  -d '{"action": "full-migration"}'
```

### 3. Validar Migración
```bash
# POST para validar
curl -X POST https://tudominio.com/api/migrate-unified \
  -H "Content-Type: application/json" \
  -d '{"action": "validate"}'
```

## 📊 Monitoreo

### 1. Logs de Vercel
- Ve a Vercel Dashboard → Functions → Logs
- Monitorea errores y rendimiento

### 2. Analytics
- Configura Vercel Analytics
- Monitorea métricas de rendimiento

### 3. Alertas
- Configura alertas para errores críticos
- Monitorea uptime del servicio

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs de Vercel**
2. **Verifica las variables de entorno**
3. **Consulta la documentación de Vercel**
4. **Revisa el estado de los servicios externos**

## 📝 Checklist de Despliegue

- [ ] Repositorio conectado a Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Dominio configurado
- [ ] Página principal accesible
- [ ] API routes funcionando
- [ ] Autenticación funcionando
- [ ] Emails funcionando
- [ ] Pagos funcionando
- [ ] Monitoreo configurado

---

**¡Tu aplicación MuWise V2 está lista para producción! 🎉**
