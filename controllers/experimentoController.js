const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const User = require("../models/User");

function generateKey(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let key = "";

  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return key;
}

exports.createExperimento = async (req, res) => {
  try {
    const db = getDB();

    const { key } = req.body;

    if (!key) {
      return res.status(400).json({
        error: "A chave do experimento é obrigatória",
      });
    }

    const exists = await db.collection("experimentos").findOne({
      key,
    });

    if (exists) {
      return res.status(409).json({
        error: "Esta chave já está em uso",
      });
    }

    const experimento = {
      ...req.body,
      userId: new ObjectId(req.userId),
      createdAt: new Date(),
    };

    const result = await db.collection("experimentos").insertOne(experimento);

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: {
        experimentKeys: key,
      },
    });

    res.status(201).json({
      message: "Experimento criado com sucesso",
      insertedId: result.insertedId,
      key,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.getMyExperimentos = async (req, res) => {
  try {
    const db = getDB();

    const experimentos = await db
      .collection("experimentos")
      .find({
        userId: new ObjectId(req.userId),
      })
      .toArray();

    res.status(200).json(experimentos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getExperimentoByKey = async (req, res) => {
  try {
    const db = getDB();

    const experimento = await db.collection("experimentos").findOne({
      key: req.params.key,
      userId: new ObjectId(req.userId),
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

    const { key, userId, _id, ...updateData } = req.body;

    const result = await db.collection("experimentos").findOneAndUpdate(
      {
        key: req.params.key,
        userId: new ObjectId(req.userId),
      },
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
      },
    );

    if (!result || !result.value) {
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

    const result = await db.collection("experimentos").findOneAndDelete({
      key: req.params.key,
      userId: new ObjectId(req.userId),
    });

    if (!result) {
      return res.status(404).json({
        message: "Experimento não encontrado",
      });
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: {
        experimentKeys: req.params.key,
      },
    });

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

    const experimento = await db.collection("experimentos").findOne(
      {
        key: req.params.key,
        userId: new ObjectId(req.userId),
      },
      {
        projection: {
          execucoes: { $slice: 1 },
        },
      },
    );

    if (!experimento) {
      return res.status(404).json({
        message: "Experimento não encontrado",
      });
    }

    if (
      !experimento.execucoes ||
      !Array.isArray(experimento.execucoes) ||
      experimento.execucoes.length === 0
    ) {
      return res.status(400).json({
        message: "O experimento não possui execuções",
      });
    }

    const colunas = Object.keys(experimento.execucoes[0]);

    res.status(200).json(colunas);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.generateExperimentKey = async (req, res) => {
  try {
    const db = getDB();

    let key;
    let exists = true;

    while (exists) {
      key = generateKey();

      const userWithKey = await db.collection("users").findOne({
        "experimentKeys.key": key,
      });

      exists = !!userWithKey;
    }

    const keyData = {
      key,
      createdAt: new Date(),
      active: true,
    };

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(req.user.id) },
      {
        $push: {
          experimentKeys: keyData,
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(201).json({
      message: "Chave gerada com sucesso",
      key: keyData.key,
      createdAt: keyData.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao gerar chave",
      error: error.message,
    });
  }
};
