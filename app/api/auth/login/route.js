import { NextResponse } from "next/server";
const { connectDB } = require("../../../../config/db");
const { login } = require("../../../../controllers/authController");
export const runtime = "nodejs";
export async function POST(request) {
  await connectDB();
  const result = await login({ body: await request.json() });
  return NextResponse.json(result.body, { status: result.status });
}
