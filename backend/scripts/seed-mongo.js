// Seed MongoDB from the JSON files (data/tutors.json, data/offers.json,
// data/requests.json). Idempotent: only inserts into a collection when it
// is empty, so it is safe to run twice.
//
// Usage:
//   MONGODB_URI="mongodb+srv://..." npm run seed:mongo
// or with a .env file in backend/ (see .env.example).
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Tutor, Offer, Request } = require("../models");

const DATA_DIR = path.join(__dirname, "..", "data");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function seedCollection(Model, file, label) {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`${label}: already has ${count} document(s) — skipping.`);
    return 0;
  }
  const items = readJson(file);
  if (!items.length) {
    console.log(`${label}: no seed data in ${path.basename(file)} — skipping.`);
    return 0;
  }
  await Model.insertMany(items);
  console.log(`${label}: inserted ${items.length} document(s).`);
  return items.length;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Copy backend/.env.example to backend/.env and fill it in, or export MONGODB_URI.");
    process.exit(1);
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected.");

  await seedCollection(Tutor, path.join(DATA_DIR, "tutors.json"), "Tutors");
  await seedCollection(Offer, path.join(DATA_DIR, "offers.json"), "Offers");
  await seedCollection(Request, path.join(DATA_DIR, "requests.json"), "Requests");

  console.log("Seeding done.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
