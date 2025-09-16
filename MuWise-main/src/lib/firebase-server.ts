
// src/lib/firebase-server.ts
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let adminApp: App;

function getInitializedAdminApp(): App {
  if (getApps().length > 0) {
    const defaultApp = getApps().find(app => app?.name === '[DEFAULT]');
    if (defaultApp) return defaultApp;
  }
  

  const storageBucket = "my-project-1518308097106.appspot.com";

  if (process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_CONFIG) {
    console.log("[firebase-server] Using Application Default Credentials (production)");
    adminApp = initializeApp({
      storageBucket,
    });
  } else {
    console.log("[firebase-server] Using service account credentials (local dev)");
    const projectId = "my-project-1518308097106";
    const clientEmail = "firebase-adminsdk-fbsvc@my-project-1518308097106.iam.gserviceaccount.com";
    const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCpnfSHjuW/foVL\nIFKJn86oO1qqMx6gVvNOdiZH0Tyeg5oSULQ0o7Xfgf4IA9mPPhPN8HA8ojLlt41/\nfG9McPWjjmjj8LVByxzYEOM/iJppKJ98pM51X/v+PBJs+XzLVWVEEHLH2wKtFVm+\nKtIwv4GeQTamK59pMiANT1KVxeoo4r8p6X7uPhl1Pr9XAqKYkCF5/Fy5uxfY0AbX\nGa1fg2/iZHSA9nLj31O3Qt/pMZ63jQdhIRyAEf9v6lIw/hWpe+1zBTTvmVzXB+yQ\nUWisurIyGO42GuiBteyHDP341/k5k3nL7q/2K11J3gDwunRqB0yw5DQRZ3xmuodr\nNaJbGR1hAgMBAAECggEAHScI4EOvOTqFrmPfy8ervT52VspyeRx4tQOZkL5lrNjx\nojQ8xM9ecwvknXwL6JLC1KJ+p+040kK6Dy9T8c94aKQRYxv8C1LdokVEyaaw42IY\nB1RMJ+BXb1rjz9cRm+ERhqFNGQyLaTRCOG0jsz03CfwraGQXAf2bhK4dg6CAnoYS\nlwtETGi4xgjtwkC9znWEJMz5RFHCVnoK68oT2Vqd8VylcTHI0ALp6AEUIT+z1FDw\nMMpJKz/xJOeA2ZfHCX7a6wJj/aAEvMmInUGzaZfxs6qztGG3NEOQowRKCtbmidMt\nYUt3sSqxAwdQ+3iaEAdFk0a+7Qn7L0M0RbpS1I+wAQKBgQDcXo5dxe1hgnBD2l0s\nogzPQOZhTrTVUwFZz5KnV4rEqsmwLpi8qWvblLWqmr2CAlof45ZWHHVYmN2k+XFG\nh5WqG3j81sp9iVtj8I2X9CqPkYkIHMsk320vlSswEUtbi4i3bQGu/LTC790FxkUB\ngCE1OphE1nGBs/U3ab2jEg4IRwKBgQDFCq1qzRw8tDjxDQtHEm/9QuDvY4BKVeO8\nK2nw3LvGlNGFdjOqjRf4nTYF+xf/KXRBoggAzwqNRn1F61qc6/KGwRA96ivo1J9R\n7J8SpWVVRbwYTTA6aDigbn9TYPt+ZADG/xaeJFF2Z0Tj1Gw7cd5T8xuFU3xWfP07\ncGjkw+UpFwKBgQC0doa1ylGUScJv/pHQ7D/7NZW0WEUEcT4o8zCQ88LDPW1/ZxlT\nXpbiMgz3UlMg9ZYiiTji+dkrHbxczp1x+bSZonfY7njShzqdRDBgIOb9vVvvlczS\nPFno3oqIiZEhvcnPFGiNiYrqHI3unaiDCw+mzH5H2SkI43tLzr8qnK17HwKBgHup\nCdDfTPtj9+CAWTWPgq0lTdmvTpJYeQZdEK3TOh2UxDHITwCYcBTdRUxXm2XN9GJE\neFVZmruzI2fAHywggCLGA5V343rKBfr6T5L6LjBoBXYS61OcmP1Gm64OTYey5zH8\nYYt6K43tnbSGWi6sdeWlyv3PuVbmNl8ZWxtHPgidAoGBANwheMHXgwbZfhTHZ9Ge\nupPswPe0XZbOtKbmwLafnGeBNSapuIxn5t+T9EdcWk1snmieZKnDJIdixeTY+4sE\nCX6/OVuKpncSwtSv6lMSDcjVeJUYsLaUxJ6xtHm+EzCKeu3c9s+uYxJvbpXar7ow\neXurPZfcnuDTJpCMZNlkV3yU\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing Firebase service account details for local development."
      );
    }

    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
  }

  return adminApp;
}

const app = getInitializedAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app).bucket();
export const db = adminDb;
