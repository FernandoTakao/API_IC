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

// ================= GET ALL =================
exports.getMyExperimentos = async (req, res) => {
  try {
    const db = getDB();

    const experimentos = await db
      .collection("experimentos")
      .find({
        userId: new ObjectId(req.user.id),
      })
      .toArray();

    res.status(200).json(experimentos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= GET BY ID =================
exports.getExperimentoById = async (req, res) => {
  try {
    const db = getDB();

    const query = {
      _id: req.params.id?.trim(),
      userId: new ObjectId(req.user.id),
    };

    const experimento = await db.collection("experimentos").findOne(query);

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

// ================= GET EXPERIMENT INFO =================

const { ObjectId } = require("mongodb");

exports.getExperimentInfo = async (req, res) => {
  try {
    const db = getDB();

    const experimentos = await db
      .collection("experimentos")
      .find({
        userId: new ObjectId(req.user.id)
      })
      .toArray();

    if (experimentos.length === 0) {
      return res.status(404).json({
        message: "Nenhum experimento encontrado."
      });
    }

    const response = experimentos.map(exp => {
      const execution = exp.execucoes?.[0];

      return {
        _id: exp._id,
        modelo: execution?.modelo ?? null,
        dataset: execution?.dataset ?? null,
        dispositivo: execution?.dispositivo ?? null
      };
    });

    return res.status(200).json(response);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor."
    });
  }
};

// ================= UPDATE =================
exports.updateExperimento = async (req, res) => {
  try {
    const db = getDB();

    const query = {
      _id: req.params.id?.trim(),
      userId: new ObjectId(req.user.id),
    };

    const { _id, userId, createdAt, ...updateData } = req.body;

    updateData.updatedAt = new Date();

    const result = await db.collection("experimentos").findOneAndUpdate(
      query,
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
      }
    );

    if (!result) {
      return res.status(404).json({
        message: "Experimento não encontrado",
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// ================= DELETE =================
exports.deleteExperimento = async (req, res) => {
  try {
    const db = getDB();

    const id = req.params.id?.trim();

    const query = {
      _id: id,
      userId: new ObjectId(req.user.id),
    };

    const experimento = await db.collection("experimentos").findOne(query);

    if (!experimento) {
      return res.status(404).json({
        message: "Experimento não encontrado",
      });
    }

    await db.collection("experimentos").deleteOne(query);

    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        experimentKeys: id,
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

// ================= COLUNAS =================
exports.getExperimentoColunas = async (req, res) => {
  try {
    const db = getDB();

    const query = {
      _id: req.params.id?.trim(),
      userId: new ObjectId(req.user.id),
    };

    const experimento = await db.collection("experimentos").findOne(
      query,
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

    if (!experimento.execucoes?.length) {
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

// ================= GENERATE KEY =================
exports.generateExperimentKey = async (req, res) => {
  try {
    const db = getDB();

    let key;
    let exists = true;

    while (exists) {
      key = generateKey();

      const experimento = await db.collection("experimentos").findOne({
        _id: key,
      });

      exists = Boolean(experimento);
    }

    const experimento = {
      _id: key,
      userId: new ObjectId(req.user.id),
      execucoes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("experimentos").insertOne(experimento);

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        experimentKeys: key,
      },
    });

    res.status(201).json({
      message: "Experimento criado com sucesso",
      id: key,
      createdAt: experimento.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao gerar chave",
      error: error.message,
    });
  }
};