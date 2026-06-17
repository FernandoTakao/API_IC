const crypto = require("crypto");

function generateExperimentKey(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let key = "";

  for (let i = 0; i < length; i++) {
    key += chars[crypto.randomInt(0, chars.length)];
  }

  return key;
}

module.exports = generateExperimentKey;