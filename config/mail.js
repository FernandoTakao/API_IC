const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Erro ao conectar ao servidor de e-mail:");
    console.error(error);
  } else {
    console.log("Servidor de e-mail conectado com sucesso.");
  }
});

module.exports = transporter;