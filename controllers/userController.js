const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.createUser = async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    const result = await users.insertOne(req.body);

    res.status(201).json(result);

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    const result = await users.find().toArray();

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    const db = getDB();
    const users = db.collection("users");

    const user = await users.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    const db = getDB();
    const users = db.collection("users");

    const result = await users.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
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
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json(result.value);

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    const db = getDB();
    const users = db.collection("users");

    const result = await users.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });

    if (!result.value) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      message: "Usuário deletado com sucesso",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};