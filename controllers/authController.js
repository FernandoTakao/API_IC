const User = require("../models/User");
const authService = require("../services/authService");
const emailService = require("../services/emailService");

exports.login = async (req, res) => {
  try {
    const { emailInstitucional, senha } = req.body;

    if (!emailInstitucional || !senha) {
      return res.status(400).json({
        message: "E-mail e senha são obrigatórios.",
      });
    }

    const user = await User.findOne({
      emailInstitucional,
    }).select("+senha");

    if (!user) {
      return res.status(401).json({
        message: "Credenciais inválidas.",
      });
    }

    const senhaValida = await authService.comparePassword(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        message: "Credenciais inválidas.",
      });
    }

    if (process.env.REQUIRE_EMAIL_VERIFICATION === "true" && !user.emailVerificado) {
      return res.status(403).json({
        message: "Confirme seu e-mail antes de realizar o login.",
      });
    }

    const token = authService.generateAccessToken(user._id);

    return res.status(200).json({
      message: "Login realizado com sucesso.",
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
    console.error(err);

    return res.status(500).json({
      message: "Erro interno do servidor.",
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

    if (user.emailVerificado) {
      return res.status(400).json({
        message: "Este e-mail já foi confirmado.",
      });
    }

    if (user.emailVerificationExpires < new Date()) {
      return res.status(400).json({
        message: "O link expirou. Solicite um novo e-mail de confirmação.",
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
    console.error(err);

    return res.status(500).json({
      message: "Erro interno do servidor.",
    });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { emailInstitucional } = req.body;

    if (!emailInstitucional) {
      return res.status(400).json({
        message: "E-mail é obrigatório.",
      });
    }

    const user = await User.findOne({
      emailInstitucional,
    });

    // Resposta genérica por segurança
    if (!user) {
      return res.status(200).json({
        message:
          "Se existir uma conta para este e-mail e ela ainda não estiver confirmada, um novo e-mail de verificação será enviado.",
      });
    }

    if (user.emailVerificado) {
      return res.status(400).json({
        message: "O e-mail já foi confirmado.",
      });
    }

    // Ainda existe um token válido
    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires > new Date()
    ) {
      return res.status(429).json({
        message:
          "Já existe um e-mail de verificação válido. Aguarde sua expiração antes de solicitar outro.",
      });
    }

    const verificationToken = authService.generateVerificationToken();

    const verificationExpiration = authService.generateVerificationExpiration();

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpiration;

    await user.save();

    await emailService.sendVerificationEmail(
      user.emailInstitucional,
      verificationToken,
    );

    return res.status(200).json({
      message:
        "Se existir uma conta para este e-mail e ela ainda não estiver confirmada, um novo e-mail de verificação será enviado.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Erro interno do servidor.",
    });
  }
};
