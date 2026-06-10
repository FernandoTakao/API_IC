const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();

    db = client.db("testeCSV");

    console.log("MongoDB Driver conectado");

    await mongoose.connect(uri, {
      dbName: "testeCSV",
    });

    console.log("Mongoose conectado");
  } catch (err) {
    console.error(err);
  }
}

function getDB() {
  return db;
}

module.exports = {
  connectDB,
  getDB,
};
