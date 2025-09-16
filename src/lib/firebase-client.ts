
// src/lib/firebase-client.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// ⚡ Configuración de tu proyecto Firebase "Mwise"
// Estas variables de entorno se definen en .env.local y son cargadas por Next.js
export const firebaseConfig = {
  apiKey: "AIzaSyCy1m41zdKeTgZb1LaWM4KjhKqIbPpNZeA",
  authDomain: "my-project-1518308097106.firebaseapp.com",
  projectId: "my-project-1518308097106",
  storageBucket: "my-project-1518308097106.appspot.com",
  messagingSenderId: "417177493009",
  appId: "1:417177493009:web:be2611495ff86842f35bb0",
  measurementId: "G-4VEYBZ1KYJ"
};


// 🔹 Inicializar Firebase solo una vez
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔹 Inicializar servicios
const auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// 🔹 Conectar al Auth Emulator en desarrollo
if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
  console.log("Connecting to Firebase Auth Emulator at http://127.0.0.1:9099");
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  } catch (e) {
    console.warn("Could not connect to Firebase Auth Emulator. Already connected or another issue occurred.", e);
  }
}

// 🔹 Exportar app y servicios para usar en todo el proyecto
export { app, auth, db, storage };
