// src/services/emailService.ts
import { Resend } from "resend";
import { generateSigningToken, type SigningTokenPayload } from '@/lib/signing-links';

export class EmailService {
  async sendSignatureRequest({
    name,
    email,
    agreementId,
    signerId,
    agreementTitle,
    isGuest = false,
  }: {
    name: string;
    email: string;
    agreementId: string;
    signerId: string;
    agreementTitle: string;
    isGuest?: boolean;
  }): Promise<void> {
    const { RESEND_API_KEY, EMAIL_FROM, JWT_SECRET, NEXT_PUBLIC_BASE_URL } = process.env;

    if (!RESEND_API_KEY || !EMAIL_FROM || !JWT_SECRET || !NEXT_PUBLIC_BASE_URL) {
      const missingVars = [
        !RESEND_API_KEY && "RESEND_API_KEY",
        !EMAIL_FROM && "EMAIL_FROM",
        !JWT_SECRET && "JWT_SECRET",
        !NEXT_PUBLIC_BASE_URL && "NEXT_PUBLIC_BASE_URL"
      ].filter(Boolean).join(', ');
      
      console.error(`Email service error: Missing required environment variables: ${missingVars}`);
      throw new Error(`El servicio de correo no está configurado correctamente. Faltan variables críticas.`);
    }

    const resend = new Resend(RESEND_API_KEY);
    
    const tokenPayload: SigningTokenPayload = {
        agreementId,
        signerId,
        email,
        purpose: isGuest ? 'guest-signing' : 'user-signing',
    };
    
    const token = generateSigningToken(tokenPayload);

    const signatureUrl = isGuest
      ? `${NEXT_PUBLIC_BASE_URL}/sign/${token}`
      : `${NEXT_PUBLIC_BASE_URL}/sign?token=${token}`;

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: `Invitación para Firmar: ${agreementTitle}`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 25px; font-size: 24px;">Invitación para Firmar Documento</h2>
            <p style="color: #34495e; font-size: 16px;">Hola ${name},</p>
            <p style="color: #34495e; font-size: 16px;">Has sido invitado a firmar el documento: <strong>${agreementTitle}</strong>.</p>
            <p style="color: #34495e; font-size: 16px;">Por favor, inicia sesión o crea una cuenta para revisar y firmar el documento de forma segura.</p>
            <div style="text-align: center; margin: 35px 0;">
              <a href="${signatureUrl}" style="background-color: #3498db; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                Acceder al Documento
              </a>
            </div>
            <p style="font-size: 14px; color: #7f8c8d; text-align: center; border-top: 1px solid #ecf0f1; padding-top: 20px; margin-top: 30px;">
              Si no esperabas este correo, puedes ignorarlo de forma segura.
            </p>
          </div>
        </div>
        `,
      });
    } catch (error) {
      console.error("Error sending email via Resend:", error);
      throw new Error("El servicio de correo no pudo enviar la solicitud. Por favor, inténtalo de nuevo más tarde.");
    }
  }
}
