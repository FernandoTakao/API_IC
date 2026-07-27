import { NextResponse } from "next/server";
const { connectDB } = require("../../../../config/db");
const { getAuthenticatedUser } = require("../../../../lib/auth");
const {
  generateExperimentKey,
} = require("../../../../controllers/experimentoController");
export const runtime = "nodejs";
export async function POST(request) {
  const auth = getAuthenticatedUser(request);
  if (!auth.user) return NextResponse.json(auth.body, { status: auth.status });
  await connectDB();
  const result = await generateExperimentKey({ user: auth.user });
  return NextResponse.json(result.body, { status: result.status });
}
