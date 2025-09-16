
# MuWise

MuWise es una aplicación web para crear, gestionar y firmar acuerdos musicales de forma segura y profesional. Combina Next.js (App Router), TypeScript y Firebase (Auth, Firestore, Storage, App Hosting). Integra IA con Genkit + Google AI para validar información de contratos y detectar posibles conflictos de derechos. Es extensible para enriquecer contratos con metadatos públicos de la API de Spotify.

> Objetivo: simplificar el ciclo de vida de acuerdos musicales (split sheets, contratos de servicios, licencias) con firma electrónica multiusuario y almacenamiento seguro.

---

## Tabla de contenidos

- [Características clave](#características-clave)
- [Tecnologías](#tecnologías)
- [Arquitectura y estructura del proyecto](#arquitectura-y-estructura-del-proyecto)
- [Solución de Problemas (Troubleshooting)](#solución-de-problemas-troubleshooting)
- [Flujo de firma electrónica](#flujo-de-firma-electrónica)
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
   │  ├─ signing-links.ts   # Genera/verifica tokens JWT para firmas
   │  └─ stripe.ts          # Lógica de cliente de Stripe
   ├─ services/             # Lógica de negocio (Agreement, User, Email)
   └─ types/                # Modelos y tipos (Agreement, User, etc.)
```

---

## Solución de Problemas (Troubleshooting)

### Error: "Failed to parse private key: Error: Unparsed DER bytes remain after ASN.1 parsing."

Este es el error más crítico y ocurre cuando la `private_key` de la cuenta de servicio de Firebase no se formatea correctamente en las variables de entorno.

**Causa Raíz**: Las variables de entorno (tanto en `.env.local` como en los secretos de producción) no manejan bien los saltos de línea (`\n`) dentro de la clave privada. Al leer la variable, la clave se deforma y el SDK de Admin no puede parsearla.

**Solución Definitiva (Implementada)**:
La solución adoptada es separar las partes de la cuenta de servicio en variables de entorno individuales y reconstruir el objeto de credencial en `firebase-server.ts`.

1.  **Variables de Entorno Separadas**: En lugar de un gran JSON en una variable, usamos:
    *   `FIREBASE_PROJECT_ID`
    *   `FIREBASE_CLIENT_EMAIL`
    *   `FIREBASE_PRIVATE_KEY` (esta contendrá la clave con `\n` escapados como `\\n`)

2.  **Reconstrucción en el Servidor (`firebase-server.ts`)**: El código del servidor lee estas variables y, crucialmente, reemplaza los `\\n` por `\n` en la clave privada antes de pasársela al SDK de Admin.
    ```typescript
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      // ...
    });
    ```
Este método es más limpio, seguro y evita por completo los errores de formato de la clave privada.

---

## Flujo de firma electrónica

1. Autenticación del usuario (Firebase Auth).
2. Acceso al acuerdo y selección del firmante.
3. Dibujo de la firma y aceptación de términos legales visibles.
4. Aplicación de la firma:
   - Se guarda la imagen de la firma (Data URL) y se registra `signedAt`.
   - Se marca el firmante como `signed`; se actualiza el estado del acuerdo en Firestore.
5. Enlaces seguros:
   - Se generan con JWT, ligados a `agreementId` + `signerId`, con expiración configurable.
   - Verificación del token en el endpoint de firma.
6. Notificación:
   - Envío de correo con el enlace de firma.

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz para desarrollo. En producción, estas deben ser configuradas en `apphosting.yaml` o como secretos en Google Secret Manager.

| Variable                             | Entorno       | Tipo en Cloud Run | Descripción                                             |
| ------------------------------------ | ------------- | ----------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`       | Local/Prod    | **Secreto**       | Clave de API pública de Firebase (delante)              |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`    | Local/Prod    | Texto plano       | ID del proyecto de Firebase (para cliente y servidor)   |
| `FIREBASE_STORAGE_BUCKET`            | Local/Prod    | Texto plano       | Bucket de Cloud Storage                                 |
| `FIREBASE_CLIENT_EMAIL`              | **Local/Prod**| **Secreto**       | Email de la cuenta de servicio del Admin SDK            |
| `FIREBASE_PRIVATE_KEY`               | **Local/Prod**| **Secreto**       | Clave privada de la cuenta de servicio del Admin SDK    |
| `NEXT_PUBLIC_BASE_URL`               | Local/Prod    | Texto plano       | URL pública de la app (para enlaces, etc.)              |
| `JWT_SECRET`                         | Local/Prod    | **Secreto**       | Clave para firmar tokens de enlaces                     |
| `RESEND_API_KEY`                     | Local/Prod    | **Secreto**       | Clave de API de Resend para enviar correos              |
| `EMAIL_FROM`                         | Local/Prod    | Texto plano       | Remitente de correo por defecto                         |
| `STRIPE_SECRET_KEY`                  | Local/Prod    | **Secreto**       | Clave secreta de Stripe                                 |
| `STRIPE_WEBHOOK_SECRET`              | Local/Prod    | **Secreto**       | Secreto para verificar webhooks (`whsec_...`)           |
| `CREATOR_MONTHLY`, `PRO_ANNUAL` etc. | Local/Prod    | Texto plano       | IDs de Precios de Stripe                                |

---

## Requisitos y puesta en marcha

- Node.js 18+
- npm 9+ (o pnpm/yarn)

Instalación y desarrollo:

```bash
git clone https://github.com/ferangarita01/MuWise.git
cd MuWise
npm install

# Configura .env.local con las variables anteriores
npm run dev
```

---

## Despliegue

MuWise está preparado para Firebase App Hosting.

- Revisa `apphosting.yaml` para asegurar que enlaza a los secretos correctos.
- Despliega desde Firebase Console o usando la CLI de Firebase.
- Protege tus secretos (`FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, etc.) en Google Secret Manager.

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
