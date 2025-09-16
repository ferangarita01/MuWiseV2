// src/lib/emailService.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendSignatureRequest({
    email,
    agreementId,
    agreementTitle,
  }: {
    email: string;
    agreementId: string; // token seguro
    agreementTitle: string;
  }) {
    if (!process.env.RESEND_API_KEY) throw new Error("Resend API Key no configurada");
    if (!process.env.EMAIL_FROM) throw new Error("El remitente no está configurado");

    const signatureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/sign/${agreementId}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Solicitud de firma: ${agreementTitle}`,
      html: `
        <div style="font-family: sans-serif; line-height:1.6;">
          <h2>Solicitud de Firma</h2>
          <p>Hola,</p>
          <p>Has sido invitado a firmar el acuerdo: <strong>${agreementTitle}</strong></p>
          <p>
            <a href="${signatureUrl}" style="background-color:#7c3aed;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">
              Revisar y Firmar
            </a>
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
          <p style="font-size:12px;color:#777;">Enviado a través de Muwise.</p>
        </div>
      `,
    });
  }
}
