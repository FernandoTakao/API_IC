const { getDB } = require("../config/db");

exports.createExperimento = async (req, res) => {
  try {
    const db = getDB();
    const experimentos = db.collection("experimentos");

    const result = await experimentos.insertOne(req.body);

    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.getExperimentos = async (req, res) => {
  try {
    const db = getDB();
    const experimentos = db.collection("experimentos");

    const result = await experimentos.find().toArray();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getExperimentoById = async (req, res) => {
  try {
    const db = getDB();
    const experimentos = db.collection("experimentos");

    const experimento = await experimentos.findOne({
      _id: Number(req.params.id),
    });

    if (!experimento) {
      return res.status(404).json({
        message: "Experimento não encontrado",
      });
    }

    res.status(200).json(experimento);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateExperimento = async (req, res) => {
  try {
    const db = getDB();
    const experimentos = db.collection("experimentos");

    const result = await experimentos.findOneAndUpdate(
      {
        _id: Number(req.params.id),
      },
      {
        $set: req.body,
      },
      {
        returnDocument: "after",
      }
    );

    if (!result.value) {
      return res.status(404).json({
        message: "Experimento não encontrado",
      });
    }

    res.status(200).json(result.value);

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.deleteExperimento = async (req, res) => {
  try {
    const db = getDB();
    const experimentos = db.collection("experimentos");

    const result = await experimentos.findOneAndDelete({
      _id: Number(req.params.id),
    });

    if (!result.value) {
      return res.status(404).json({
        message: "Experimento não encontrado",
      });
    }

    res.status(200).json({
      message: "Experimento deletado com sucesso",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getExperimentoColunas = async (req, res) => {
  try {
    const db = getDB();
    const experimentos = db.collection("experimentos");

    const experimento = await experimentos.findOne(
      {
        _id: Number(req.params.id),
      },
      {
        projection: {
          execucoes: { $slice: 1 },
        },
      }
    );

    if (!experimento) {
      return res.status(404).json({
        message: "Experimento não encontrado",
      });
    }

    const colunas = Object.keys(
      experimento.execucoes[0]
    );

    res.status(200).json(colunas);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
