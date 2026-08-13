import { NextResponse } from "next/server";

const { timingSafeEqual } = require("crypto");
const { connectDB } = require("../../../../config/db");
const {
  arquivarExperimentosSemExecucoes,
} = require("../../../../services/experimentCleanupService");

export const runtime = "nodejs";

function segredoValido(request) {
  const segredoConfigurado = process.env.ARCHIVE_TRIGGER_SECRET;
  const segredoRecebido = request.headers.get("x-archive-trigger-secret");

  if (!segredoConfigurado || !segredoRecebido) return false;

  const esperado = Buffer.from(segredoConfigurado);
  const recebido = Buffer.from(segredoRecebido);

  return (
    esperado.length === recebido.length &&
    timingSafeEqual(esperado, recebido)
  );
}

export async function POST(request) {
  if (!segredoValido(request)) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    await connectDB();
    const quantidadeArquivada = await arquivarExperimentosSemExecucoes();

    return NextResponse.json({
      message: "Arquivamento de experimentos concluído",
      quantidadeArquivada,
    });
  } catch (err) {
    console.error("Erro ao executar arquivamento via trigger:", err);
    return NextResponse.json(
      { message: "Erro ao arquivar experimentos" },
      { status: 500 },
    );
  }
}
