const fs = require("fs/promises");
const path = require("path");
const transporter = require("../config/mail");

async function sendVerificationEmail(email, token) {
  const verificationLink =
    `${process.env.API_URL}/api/auth/verify-email?token=${token}`;

  const templatePath = path.join(
    __dirname,
    "../templates/verificationEmail.html"
  );

  let html = await fs.readFile(templatePath, "utf-8");

  html = html.replaceAll("{{verificationLink}}", verificationLink);

  await transporter.sendMail({
    from: `"ICD Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmação de e-mail",
    html,
  });
}

module.exports = {
  sendVerificationEmail,
};