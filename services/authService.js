const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateVerificationToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

function generateVerificationExpiration(minutes = 5) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateAccessToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
}

module.exports = {
  generateVerificationToken,
  generateVerificationExpiration,
  hashPassword,
  comparePassword,
  generateAccessToken,
};