const User = require("../models/User");
const bcrypt = require("bcrypt");
const authService = require("../services/authService");
const emailService = require("../services/emailService");


exports.createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      emailInstitucional: req.body.emailInstitucional,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Este e-mail já está cadastrado.",
      });
    }

    const senhaHash = await authService.hashPassword(
      req.body.senha
    );

    const verificationToken =
      authService.generateVerificationToken();

    const verificationExpiration =
      authService.generateVerificationExpiration();

    const user = await User.create({
      ...req.body,

      senha: senhaHash,

      emailVerificado: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiration,
    });

    await emailService.sendVerificationEmail(
      user.emailInstitucional,
      verificationToken
    );

    res.status(201).json({
      message:
        "Usuário criado com sucesso. Verifique seu e-mail para ativar sua conta.",
    });

  } catch (err) {
    console.error(err);

    res.status(400).json({
      error: err.message,
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