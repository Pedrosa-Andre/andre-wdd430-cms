const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

let isDbInitialized = false;

const initDb = async (callback) => {
  if (isDbInitialized) {
    console.log("DB is already initialized!");
    return callback(null);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isDbInitialized = true;
    console.log("DB connection established");
    callback(null);
  } catch (err) {
    console.error("DB connection error:", err);
    callback(err);
  }
};

const getDb = () => {
  if (!isDbInitialized) {
    throw Error("DB not initialized");
  }
  return mongoose.connection;
};

module.exports = { initDb, getDb };
