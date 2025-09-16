# MuWise

MuWise es una aplicación web para crear, gestionar y firmar acuerdos musicales de forma segura y profesional. Combina Next.js (App Router), TypeScript y Firebase (Auth, Firestore, Storage, App Hosting). Integra IA con Genkit + Google AI para validar información de contratos y detectar posibles conflictos de derechos. Es extensible para enriquecer contratos con metadatos públicos de la API de Spotify.

> Objetivo: simplificar el ciclo de vida de acuerdos musicales (split sheets, contratos de servicios, licencias) con firma electrónica multiusuario y almacenamiento seguro.

---

## Tabla de contenidos

- [Características clave](#características-clave)
- [Tecnologías](#tecnologías)
- [Arquitectura y estructura del proyecto](#arquitectura-y-estructura-del-proyecto)
- [🔥 Inicialización del SDK de Firebase Admin](#-inicialización-del-sdk-de-firebase-admin)
- [Variables de entorno](#variables-de-entorno)
- [Requisitos y puesta en marcha](#requisitos-y-puesta-en-marcha)
- [Despliegue](#despliegue)
- [Roadmap](#roadmap)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## Características clave

- Gestión integral de acuerdos musicales:
  - Split sheets bilingües, contratos de servicio (p. ej., DJ Service Agreement), licencias y colaboraciones.
  - Validaciones de negocio (porcentajes de splits, roles y campos requeridos).
- Firma electrónica multiusuario:
  - Selección de firmantes, dibujo de firma, aceptación explícita de términos y trazabilidad.
  - Enlaces de firma seguros (JWT) y expirables; estado por firmante (pendiente/firmado).
  - Descarga de PDF/certificado digital (módulo de certificado en preparación).
- Notificaciones:
  - Solicitud de firma vía email con enlace seguro.
- Almacenamiento y datos:
  - Datos en Firestore; documentos firmados y assets en Cloud Storage.
- IA aplicada:
  - Genkit + Google AI para validación contextual y detección de conflictos de derechos.
- Extensible con Spotify:
  - Enriquecimiento de contratos con metadata pública (título, artistas, fechas).

---

## Tecnologías

- Frontend: Next.js (App Router) + React + TypeScript
- UI: Tailwind CSS + ShadCN UI
- Backend-as-a-Service: Firebase (Auth, Firestore, Storage, App Hosting)
- Pagos: Stripe Checkout
- IA: Genkit + Google AI (Gemini)
- Seguridad de enlaces: JWT (jsonwebtoken)

---

## Arquitectura y estructura del proyecto

```
ferangarita01-muwise/
├─ apphosting.yaml
├─ firebase.json
├─ firestore.rules
├─ storage.rules
├─ tailwind.config.ts
└─ src/
   ├─ actions/
   │  ├─ agreement/         # Acciones del servidor para acuerdos
   │  └─ user/              # Acciones del servidor para usuarios
   ├─ ai/
   │  └─ genkit.ts          # Configuración Genkit + Google AI
   ├─ app/                  # App Router (Next.js)
   │  ├─ api/
   │  │  ├─ auth/session/route.ts   # Gestión de cookies de sesión
   │  │  └─ stripe/create-subscription/route.ts # Crea sesión de Stripe Checkout
   │  ├─ auth/...(signin/signup)
   │  └─ dashboard/
   │     ├─ agreements/
   │     │  ├─ [agreementId]/page.tsx
   │     │  └─ page.tsx
   │     ├─ billing/
   │     └─ profile/, settings/
   ├─ components/
   │  ├─ agreement/         # UI y flujo de firma
   │  └─ ui/                # Componentes de ShadCN UI
   ├─ hooks/
   │  └─ use-auth.tsx       # Sincroniza estado de autenticación y cookie
   ├─ lib/
   │  ├─ firebase-client.ts
   │  ├─ firebase-server.ts # Configuración del SDK de Admin
   │  └─ signing-links.ts   # Genera/verifica tokens JWT para firmas
   │  └─ stripe.ts          # Lógica de cliente de Stripe
   ├─ services/             # Lógica de negocio (Agreement, User, Email)
   └─ types/                # Modelos y tipos (Agreement, User, etc.)
```

---

## 🔥 Inicialización del SDK de Firebase Admin

- **Local Dev**  
  Usamos `.env.local` con:
  - `FIREBASE_PROJECT_ID`  
  - `FIREBASE_CLIENT_EMAIL`  
  - `FIREBASE_PRIVATE_KEY` (formateada con `\n`)

- **Production (Firebase App Hosting / Cloud Run)**  
  - **NO** configuramos secretos `FIREBASE_*` en `apphosting.yaml`.
  - Usamos **Application Default Credentials (ADC)** automáticamente.  

➝ Esto evita errores de inicialización y sigue las buenas prácticas de Google Cloud.

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz para desarrollo. En producción, estas deben ser configuradas como secretos en Google Secret Manager y referenciadas en `apphosting.yaml`.

| Variable                             | Entorno Local                      | Entorno Producción (App Hosting)                                           | Descripción                                                                |
| ------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_*`             | **Requerido** (varias)             | **Requerido** (varias)                                                     | Configuración del SDK de cliente de Firebase.                                  |
| `FIREBASE_PROJECT_ID`                | **Requerido**                      | No necesario (usa ADC)                                                     | ID del proyecto de Firebase (para servidor local).                         |
| `FIREBASE_CLIENT_EMAIL`              | **Requerido**                      | No necesario (usa ADC)                                                     | Email de la cuenta de servicio del Admin SDK (para servidor local).        |
| `FIREBASE_PRIVATE_KEY`               | **Requerido**                      | No necesario (usa ADC)                                                     | Clave privada de la cuenta de servicio del Admin SDK (para servidor local).|
| `FIREBASE_STORAGE_BUCKET`            | **Requerido**                      | **Requerido**                                                              | Bucket de Cloud Storage.                                                   |
| `NEXT_PUBLIC_BASE_URL`               | **Requerido** (`http://localhost:3000`) | **Requerido** (URL pública)                                                | URL pública de la app (para enlaces, etc.).                                |
| `JWT_SECRET`                         | **Requerido**                      | **Requerido** (como secreto)                                               | Clave para firmar tokens de enlaces de firma.                              |
| `RESEND_API_KEY`                     | **Requerido**                      | **Requerido** (como secreto)                                               | Clave de API de Resend para enviar correos.                                 |
| `EMAIL_FROM`                         | **Requerido**                      | **Requerido**                                                              | Remitente de correo por defecto.                                           |
| `STRIPE_SECRET_KEY`                  | **Requerido**                      | **Requerido** (como secreto)                                               | Clave secreta de Stripe.                                                   |
| `STRIPE_WEBHOOK_SECRET`              | **Requerido**                      | **Requerido** (como secreto)                                               | Secreto para verificar webhooks (`whsec_...`).                             |
| `CREATOR_MONTHLY`, `PRO_ANNUAL` etc. | **Requerido**                      | **Requerido**                                                              | IDs de Precios de Stripe.                                                  |

---

## Requisitos y puesta en marcha

- Node.js 18+
- npm 9+ (o pnpm/yarn)

Instalación y desarrollo:

```bash
git clone https://github.com/ferangarita01/MuWise.git
cd MuWise
npm install

# Configura .env.local con las variables anteriores para desarrollo local
npm run dev
```

---

## Despliegue

MuWise está preparado para Firebase App Hosting.

- **No** incluyas las variables de Firebase Admin SDK (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) en `apphosting.yaml`. App Hosting usará ADC.
- Despliega desde Firebase Console o usando la CLI de Firebase.
- Protege tus secretos de aplicación (Stripe, JWT, etc.) en Google Secret Manager y referéncialos en `apphosting.yaml`.

---

## Roadmap

- Certificado digital de finalización con hash/auditoría.
- Orden de firma (signing order) y recordatorios automáticos.
- Auditoría avanzada: IP, agente de usuario, ubicación aproximada.
- Enriquecimiento automático desde Spotify/PROs y verificación de ISRC/ISWC.
- Modo multiorganización y roles granulares (owner, approver, witness).
- Tests e2e (Cypress/Playwright) y unit tests (Vitest/Jest).

---

## Contribución

- Issues y PRs son bienvenidos.
- Por favor, discute cambios sustanciales en un issue antes de un PR.
- Mantén estilo de código consistente (ESLint, convenciones de tipos).
- Evita incluir secretos en commits.

---

## Licencia

MIT

© 2025 MuWise. Todos los derechos reservados.
