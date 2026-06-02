const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  await client.connect();

  db = client.db("testeCSV");

  console.log("MongoDB conectado");
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
