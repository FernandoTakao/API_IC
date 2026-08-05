async function arquivarExperimentosSemExecucoes() {
  try {
    const limite = new Date(Date.now() - 60 * 60 * 1000);

    const resultado = await getDB()
      .collection("experimentos")
      .updateMany(
        {
          arquivado: false,
          createdAt: { $lte: limite },
          "execucoesScript.0": { $exists: false },
          "execucoesMobile.0": { $exists: false },
        },
        {
          $set: {
            arquivado: true,
            updatedAt: new Date(),
          },
        },
      );

    return resultado.modifiedCount;
  } catch (err) {
    console.error("Erro ao arquivar experimentos:", err);
    return 0;
  }
}
