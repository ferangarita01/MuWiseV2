import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

// Activa métricas, logs y trazas en Firebase/Cloud
// Solo en entornos de producción de Google Cloud para evitar errores locales.
if (process.env.GCP_PROJECT) {
    enableFirebaseTelemetry();
}


export const ai = genkit({
  plugins: [
    googleAI(), // tu plugin de Google AI
  ],
  model: 'googleai/gemini-2.0-flash',
});
