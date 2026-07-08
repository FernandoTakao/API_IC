const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const senhaHash = await bcrypt.hash(
      req.body.senha,
      10
    );

    const user = await User.create({
      ...req.body,
      senha: senhaHash
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user
    });

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      error: "ID inválido",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      message: "Usuário atualizado com sucesso",
      user,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      message: "Usuário deletado com sucesso",
    });
  } catch (err) {
    res.status(400).json({
      error: "ID inválido",
    });
  }
};