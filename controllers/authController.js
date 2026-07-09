const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../services/authService")

exports.login = async (req, res) => {
  try {
    const { emailInstitucional, senha } = req.body;

    if (!emailInstitucional || !senha) {
      return res.status(400).json({
        message: "E-mail e senha são obrigatórios",
      });
    }

    const user = await User.findOne({
      emailInstitucional,
    }).select("+senha");

    if (!user) {
      return res.status(401).json({
        message: "Credenciais inválidas",
      });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        message: "Credenciais inválidas",
      });
    }

    if (!user.emailVerificado) {
      return res.status(403).json({
        message: "Confirme seu e-mail antes de realizar o login.",
      });
    }
    
    const token = authService.generateAccessToken(user._id);

    res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        nomeCompleto: user.nomeCompleto,
        emailInstitucional: user.emailInstitucional,
        instituicao: user.instituicao,
        laboratorio: user.laboratorio,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Token não informado.",
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Token inválido.",
      });
    }

    if (user.emailVerificationExpires < new Date()) {
      return res.status(400).json({
        message: "Token expirado.",
      });
    }

    user.emailVerificado = true;

    user.emailVerificationToken = null;

    user.emailVerificationExpires = null;

    await user.save();

    return res.status(200).json({
      message: "E-mail confirmado com sucesso! Agora você já pode fazer login.",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};