import { NextResponse } from "next/server";

const adminPassword = process.env.ADMIN_PASSWORD || "102030";

export async function POST(request: Request) {
  const body = await request.json() as { password?: unknown };

  if (body.password !== adminPassword) {
    return NextResponse.json({ error: "الرقم السري غير صحيح" }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}