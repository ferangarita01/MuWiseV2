import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  const secret = process.env.JWT_SECRET;

  return NextResponse.json({
    jwtSecretDefined: !!secret,
    jwtSecretLength: secret?.length || 0,
    nodeEnv: process.env.NODE_ENV,
  });
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const decoded = jwt.decode(token);
    return NextResponse.json({
      decoded,
      note: "Esto solo decodifica sin verificar la firma",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}