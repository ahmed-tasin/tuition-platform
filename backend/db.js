// MongoDB connection (Mongoose).
// Returns true when connected, false when MONGODB_URI is unset or the
// connection fails. Never throws — the server falls back to JSON files.
const mongoose = require("mongoose");

let connectAttempted = false;

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("MONGODB_URI is not set — using JSON-file storage.");
    return false;
  }
  if (connectAttempted) return mongoose.connection.readyState === 1;
  connectAttempted = true;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected.");
    return true;
  } catch (err) {
    console.error("MongoDB connection failed — using JSON-file storage:", err.message);
    return false;
  }
}

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectMongo, isMongoReady };
