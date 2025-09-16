// src/app/api/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, agreementId, agreementTitle } = await req.json();

    if (!email || !agreementId || !agreementTitle) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const token = crypto.randomUUID();

    await adminDb
      .collection("agreements")
      .doc(agreementId)
      .collection("signers")
      .doc(token)
      .set({
        email,
        status: "pending",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
      });

    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY no está configurada");
      }

      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const signatureUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sign/${token}`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: email,
        subject: `Solicitud de firma: ${agreementTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Solicitud de Firma Digital</h2>
            <p>Hola,</p>
            <p>Has sido invitado a firmar el siguiente documento:</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>${agreementTitle}</strong>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signatureUrl}" 
                 style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Revisar y Firmar Documento
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              <strong>Nota:</strong> Este enlace expira en 7 días por seguridad.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              Este correo fue enviado automáticamente por MuWise. Por favor, no respondas a este mensaje.
            </p>
          </div>
        `,
      });

    } catch (emailError: any) {
      console.error("Error enviando email:", emailError);
      return NextResponse.json({ 
        message: "Firmante agregado, pero falló el envío de email",
        error: emailError.message,
        token 
      }, { status: 207 });
    }

    return NextResponse.json({ 
      message: "Firmante agregado y correo enviado exitosamente",
      token
    });

  } catch (error: any) {
    console.error("Error en addSigner:", error);
    return NextResponse.json({ 
      error: error.message || "Error interno del servidor" 
    }, { status: 500 });
  }
}
