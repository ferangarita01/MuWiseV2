// src/lib/scripts/migrateAgreements.ts

/*
 * =============================================================================
 * SCRIPT DE MIGRACIÓN PARA ACTUALIZAR ACUERDOS EXISTENTES
 * =============================================================================
 * 
 * Propósito:
 * Este script añade un nuevo campo `signerEmails` a todos los documentos
 * en la colección `agreements` de Firestore. Este campo es un array de strings
 * que contiene los correos electrónicos de todos los firmantes (`signers`).
 * 
 * Razón:
 * Firestore no puede realizar consultas `array-contains` en arrays de objetos
 * buscando solo una propiedad (como el email). Al desnormalizar los datos y
 * crear un array simple de correos, podemos realizar consultas eficientes para
 * encontrar todos los acuerdos en los que un usuario es firmante.
 * 
 * Cómo ejecutar este script:
 * 1.  Crea una nueva ruta de API temporal en tu proyecto. Por ejemplo:
 *     `src/app/api/migrate/route.ts`
 * 
 * 2.  Pega el siguiente código en ese archivo de ruta:
 *     ```typescript
 *     import { NextResponse } from 'next/server';
 *     import { migrateAgreements } from '@/lib/scripts/migrateAgreements';
 * 
 *     export async function GET(request: Request) {
 *       // Opcional: Añade una capa de seguridad, como un token secreto.
 *       const { searchParams } = new URL(request.url);
 *       const secret = searchParams.get('secret');
 *       if (secret !== 'tu-clave-secreta-aqui') {
 *         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *       }
 * 
 *       try {
 *         const result = await migrateAgreements();
 *         return NextResponse.json(result);
 *       } catch (error: any) {
 *         return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
 *       }
 *     }
 *     ```
 * 
 * 3.  Inicia tu servidor de desarrollo (`npm run dev`).
 * 
 * 4.  Abre tu navegador y visita la siguiente URL (reemplazando con tu clave secreta):
 *     `http://localhost:3000/api/migrate?secret=tu-clave-secreta-aqui`
 * 
 * 5.  Espera a que el script termine. Verás un mensaje JSON en el navegador
 *     indicando el resultado.
 * 
 * 6.  Una vez completado, ¡elimina el archivo de ruta de API (`src/app/api/migrate/route.ts`)
 *     para mantener la seguridad de tu aplicación!
 * 
 * =============================================================================
 */

import { adminDb } from '@/lib/firebase-server';
import type { Signer } from '@/types/legacy';

export async function migrateAgreements() {
  console.log('Starting migration of agreements...');

  const agreementsRef = adminDb.collection('agreements');
  const snapshot = await agreementsRef.get();

  if (snapshot.empty) {
    console.log('No agreements found to migrate.');
    return { status: 'success', message: 'No agreements found to migrate.' };
  }

  const batch = adminDb.batch();
  let updatedCount = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    const signers = data.signers as Signer[] | undefined;

    // Solo actualiza si hay firmantes y el campo signerEmails no existe o necesita actualización
    if (Array.isArray(signers) && signers.length > 0) {
      const currentSignerEmails = (data.signerEmails as string[] | undefined) || [];
      const newSignerEmails = signers.map(s => s.email).filter(Boolean); // Filter out any undefined/null emails
      
      // Compara si los arrays son diferentes para evitar escrituras innecesarias
      if (JSON.stringify(currentSignerEmails.sort()) !== JSON.stringify(newSignerEmails.sort())) {
        batch.update(doc.ref, { signerEmails: newSignerEmails });
        updatedCount++;
        console.log(`Scheduling update for document ${doc.id}`);
      }
    }
  });

  if (updatedCount === 0) {
    console.log('Migration complete. No documents needed updating.');
    return { status: 'success', message: 'All documents are already up-to-date.' };
  }

  await batch.commit();

  console.log(`Migration complete. Successfully updated ${updatedCount} documents.`);
  return { status: 'success', message: `Migration complete. Successfully updated ${updatedCount} documents.` };
}
