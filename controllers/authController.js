const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { emailInstitucional, senha } = req.body;

    if (!emailInstitucional || !senha) {
      return res.status(400).json({
        message: "E-mail e senha são obrigatórios"
      });
    }

    const user = await User.findOne({
      emailInstitucional
    }).select("+senha");

    if (!user) {
      return res.status(401).json({
        message: "Credenciais inválidas"
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      user.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        message: "Credenciais inválidas"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        nomeCompleto: user.nomeCompleto,
        emailInstitucional: user.emailInstitucional,
        instituicao: user.instituicao,
        laboratorio: user.laboratorio
      }
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};