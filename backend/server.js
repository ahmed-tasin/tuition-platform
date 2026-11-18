const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { connectMongo, isMongoReady } = require("./db");
const { Tutor, Offer, Request, cleanDoc } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const TUTORS_FILE = path.join(DATA_DIR, "tutors.json");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");
const OFFERS_FILE = path.join(DATA_DIR, "offers.json");
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

app.use(express.json());

// CORS: the frontend on GitHub Pages calls this API cross-origin when the
// backend is hosted (e.g. on Render). Allow it; the API has no auth.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.static(FRONTEND_DIR));

// ---------- Storage layer ----------
// MongoDB is used when connected; otherwise the JSON files are used exactly
// as before. Every route reads the full list and saves it back, so the two
// stores stay interchangeable.
const STORES = {
  tutors: { Model: Tutor, file: TUTORS_FILE },
  offers: { Model: Offer, file: OFFERS_FILE },
  requests: { Model: Request, file: REQUESTS_FILE }
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function loadAll(kind) {
  const { Model, file } = STORES[kind];
  if (isMongoReady()) {
    const docs = await Model.find().sort({ id: 1 }).lean();
    return docs.map(cleanDoc);
  }
  return readJson(file, []);
}

async function saveAll(kind, items) {
  const { Model, file } = STORES[kind];
  if (isMongoReady()) {
    await Model.deleteMany({});
    if (items.length) await Model.insertMany(items);
    return;
  }
  writeJson(file, items);
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

// ---------- Health ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "tuition-platform", db: isMongoReady() ? "mongo" : "json", time: new Date().toISOString() });
});

// ---------- Tutors ----------
app.get("/api/tutors", async (req, res) => {
  const { subject, class: cls, area, maxFee, q } = req.query;
  let tutors = await loadAll("tutors");

  if (subject) {
    tutors = tutors.filter((t) => t.subjects.includes(subject));
  }
  if (cls) {
    tutors = tutors.filter((t) => t.classes.includes(cls));
  }
  if (area) {
    tutors = tutors.filter((t) => t.areas.includes(area));
  }
  if (maxFee) {
    const max = Number(maxFee);
    if (!Number.isNaN(max)) {
      tutors = tutors.filter((t) => t.monthlyFee <= max);
    }
  }
  if (q) {
    const needle = q.toLowerCase();
    tutors = tutors.filter((t) =>
      [t.name, t.university, t.about, ...t.subjects, ...t.areas]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }

  res.json(tutors);
});

app.get("/api/tutors/:id", async (req, res) => {
  const tutors = await loadAll("tutors");
  const tutor = tutors.find((t) => String(t.id) === String(req.params.id));
  if (!tutor) {
    return res.status(404).json({ error: "টিউটর পাওয়া যায়নি" });
  }
  res.json(tutor);
});

app.post("/api/tutors", async (req, res) => {
  const body = req.body || {};
  const required = ["name", "phone", "university", "subjects", "classes", "areas", "monthlyFee"];
  const missing = required.filter(
    (key) => body[key] === undefined || body[key] === "" || (Array.isArray(body[key]) && body[key].length === 0)
  );
  if (missing.length > 0) {
    return res.status(400).json({ error: "এই তথ্যগুলো আবশ্যক: " + missing.join(", ") });
  }

  const tutors = await loadAll("tutors");
  const tutor = {
    id: nextId(tutors),
    name: String(body.name).trim(),
    university: String(body.university).trim(),
    department: body.department ? String(body.department).trim() : "",
    subjects: Array.isArray(body.subjects) ? body.subjects : [body.subjects],
    classes: Array.isArray(body.classes) ? body.classes : [body.classes],
    areas: Array.isArray(body.areas) ? body.areas : [body.areas],
    monthlyFee: Number(body.monthlyFee),
    experienceYears: Number(body.experienceYears) || 0,
    rating: 5.0,
    reviewsCount: 0,
    phone: String(body.phone).trim(),
    about: body.about ? String(body.about).trim() : "",
    available: true,
    reviews: [],
    createdAt: new Date().toISOString()
  };

  tutors.push(tutor);
  await saveAll("tutors", tutors);
  res.status(201).json(tutor);
});

const TUTOR_PATCH_FIELDS = ["name", "university", "department", "subjects", "classes", "areas", "monthlyFee", "experienceYears", "phone", "about", "available"];

app.patch("/api/tutors/:id", async (req, res) => {
  const tutors = await loadAll("tutors");
  const tutor = tutors.find((t) => String(t.id) === String(req.params.id));
  if (!tutor) {
    return res.status(404).json({ error: "টিউটর পাওয়া যায়নি" });
  }
  const body = req.body || {};
  TUTOR_PATCH_FIELDS.forEach((key) => {
    if (body[key] === undefined) return;
    if (key === "monthlyFee" || key === "experienceYears") {
      tutor[key] = Number(body[key]);
    } else if (key === "available") {
      tutor[key] = body[key] === true || body[key] === "true";
    } else if (["subjects", "classes", "areas"].includes(key)) {
      tutor[key] = Array.isArray(body[key]) ? body[key] : [body[key]];
    } else {
      tutor[key] = String(body[key]).trim();
    }
  });
  await saveAll("tutors", tutors);
  res.json(tutor);
});

app.delete("/api/tutors/:id", async (req, res) => {
  const tutors = await loadAll("tutors");
  const index = tutors.findIndex((t) => String(t.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "টিউটর পাওয়া যায়নি" });
  }
  const [removed] = tutors.splice(index, 1);
  await saveAll("tutors", tutors);
  res.json({ deleted: true, id: removed.id });
});

// ---------- Tutor requests (students / parents) ----------
app.get("/api/requests", async (req, res) => {
  res.json(await loadAll("requests"));
});

app.post("/api/requests", async (req, res) => {
  const body = req.body || {};
  const required = ["studentName", "phone", "class", "subjects", "area"];
  const missing = required.filter(
    (key) => body[key] === undefined || body[key] === "" || (Array.isArray(body[key]) && body[key].length === 0)
  );
  if (missing.length > 0) {
    return res.status(400).json({ error: "এই তথ্যগুলো আবশ্যক: " + missing.join(", ") });
  }

  const requests = await loadAll("requests");
  const request = {
    id: nextId(requests),
    studentName: String(body.studentName).trim(),
    guardianName: body.guardianName ? String(body.guardianName).trim() : "",
    phone: String(body.phone).trim(),
    class: String(body.class).trim(),
    subjects: Array.isArray(body.subjects) ? body.subjects : [body.subjects],
    area: String(body.area).trim(),
    budget: body.budget ? Number(body.budget) : null,
    preferredTime: body.preferredTime ? String(body.preferredTime).trim() : "",
    notes: body.notes ? String(body.notes).trim() : "",
    status: "নতুন",
    createdAt: new Date().toISOString()
  };

  requests.push(request);
  await saveAll("requests", requests);
  res.status(201).json(request);
});

const REQUEST_STATUSES = ["নতুন", "যোগাযোগ হয়েছে", "সম্পন্ন"];
const REQUEST_PATCH_FIELDS = ["studentName", "guardianName", "phone", "class", "subjects", "area", "budget", "preferredTime", "notes", "status"];

app.get("/api/requests/:id", async (req, res) => {
  const requests = await loadAll("requests");
  const request = requests.find((r) => String(r.id) === String(req.params.id));
  if (!request) {
    return res.status(404).json({ error: "অনুরোধ পাওয়া যায়নি" });
  }
  res.json(request);
});

app.patch("/api/requests/:id", async (req, res) => {
  const requests = await loadAll("requests");
  const request = requests.find((r) => String(r.id) === String(req.params.id));
  if (!request) {
    return res.status(404).json({ error: "অনুরোধ পাওয়া যায়নি" });
  }
  const body = req.body || {};
  if (body.status !== undefined && !REQUEST_STATUSES.includes(body.status)) {
    return res.status(400).json({ error: "সঠিক স্ট্যাটাস দিন: " + REQUEST_STATUSES.join(", ") });
  }
  REQUEST_PATCH_FIELDS.forEach((key) => {
    if (body[key] === undefined) return;
    if (key === "budget") {
      request[key] = body[key] === null || body[key] === "" ? null : Number(body[key]);
    } else if (key === "subjects") {
      request[key] = Array.isArray(body[key]) ? body[key] : [body[key]];
    } else {
      request[key] = String(body[key]).trim();
    }
  });
  await saveAll("requests", requests);
  res.json(request);
});

app.delete("/api/requests/:id", async (req, res) => {
  const requests = await loadAll("requests");
  const index = requests.findIndex((r) => String(r.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "অনুরোধ পাওয়া যায়নি" });
  }
  const [removed] = requests.splice(index, 1);
  await saveAll("requests", requests);
  res.json({ deleted: true, id: removed.id });
});

// ---------- Tuition offers (guardians / students post tuition jobs) ----------
app.get("/api/offers", async (req, res) => {
  const { subject, class: cls, location, minSalary, gender, q } = req.query;
  let offers = await loadAll("offers");

  if (subject) {
    offers = offers.filter((o) => o.subjects.includes(subject));
  }
  if (cls) {
    offers = offers.filter((o) => o.class.toLowerCase().includes(cls.toLowerCase()));
  }
  if (location) {
    offers = offers.filter((o) => o.location.toLowerCase().includes(location.toLowerCase()));
  }
  if (minSalary) {
    const min = Number(minSalary);
    if (!Number.isNaN(min)) {
      offers = offers.filter((o) => o.salary >= min);
    }
  }
  if (gender) {
    offers = offers.filter((o) => o.teacherGender === gender || o.teacherGender === "any");
  }
  if (q) {
    const needle = q.toLowerCase();
    offers = offers.filter((o) =>
      [o.location, o.class, o.preferredDepartment, o.posterName, o.notes, ...o.subjects]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }

  res.json(offers);
});

app.get("/api/offers/:id", async (req, res) => {
  const offers = await loadAll("offers");
  const offer = offers.find((o) => String(o.id) === String(req.params.id));
  if (!offer) {
    return res.status(404).json({ error: "অফার পাওয়া যায়নি" });
  }
  res.json(offer);
});

app.post("/api/offers", async (req, res) => {
  const body = req.body || {};
  const required = ["location", "class", "subjects", "salary"];
  const missing = required.filter(
    (key) => body[key] === undefined || body[key] === "" || (Array.isArray(body[key]) && body[key].length === 0)
  );
  if (missing.length > 0) {
    return res.status(400).json({ error: "এই তথ্যগুলো আবশ্যক: " + missing.join(", ") });
  }

  const offers = await loadAll("offers");
  const offer = {
    id: nextId(offers),
    teacherGender: ["male", "female", "any"].includes(body.teacherGender) ? body.teacherGender : "any",
    preferredDepartment: body.preferredDepartment ? String(body.preferredDepartment).trim() : "",
    location: String(body.location).trim(),
    class: String(body.class).trim(),
    subjects: Array.isArray(body.subjects) ? body.subjects : [body.subjects],
    studentCount: Number(body.studentCount) || 1,
    salary: Number(body.salary),
    daysPerWeek: Number(body.daysPerWeek) || 3,
    durationPerDay: body.durationPerDay ? String(body.durationPerDay).trim() : "১ ঘণ্টা",
    mediaFee: body.mediaFee === "প্রযোজ্য নয়" ? "প্রযোজ্য নয়" : "প্রযোজ্য",
    posterName: body.posterName ? String(body.posterName).trim() : "",
    phone: body.phone ? String(body.phone).trim() : "",
    notes: body.notes ? String(body.notes).trim() : "",
    status: "খোলা",
    createdAt: new Date().toISOString()
  };

  offers.push(offer);
  await saveAll("offers", offers);
  res.status(201).json(offer);
});

const OFFER_STATUSES = ["খোলা", "বন্ধ"];
const OFFER_PATCH_FIELDS = ["teacherGender", "preferredDepartment", "location", "class", "subjects", "studentCount", "salary", "daysPerWeek", "durationPerDay", "mediaFee", "posterName", "phone", "notes", "status"];

app.patch("/api/offers/:id", async (req, res) => {
  const offers = await loadAll("offers");
  const offer = offers.find((o) => String(o.id) === String(req.params.id));
  if (!offer) {
    return res.status(404).json({ error: "অফার পাওয়া যায়নি" });
  }
  const body = req.body || {};
  if (body.status !== undefined && !OFFER_STATUSES.includes(body.status)) {
    return res.status(400).json({ error: "সঠিক স্ট্যাটাস দিন: " + OFFER_STATUSES.join(", ") });
  }
  if (body.teacherGender !== undefined && !["male", "female", "any"].includes(body.teacherGender)) {
    return res.status(400).json({ error: "সঠিক লিঙ্গ পছন্দ দিন: male, female বা any" });
  }
  OFFER_PATCH_FIELDS.forEach((key) => {
    if (body[key] === undefined) return;
    if (["studentCount", "salary", "daysPerWeek"].includes(key)) {
      offer[key] = Number(body[key]);
    } else if (key === "subjects") {
      offer[key] = Array.isArray(body[key]) ? body[key] : [body[key]];
    } else {
      offer[key] = String(body[key]).trim();
    }
  });
  await saveAll("offers", offers);
  res.json(offer);
});

app.delete("/api/offers/:id", async (req, res) => {
  const offers = await loadAll("offers");
  const index = offers.findIndex((o) => String(o.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "অফার পাওয়া যায়নি" });
  }
  const [removed] = offers.splice(index, 1);
  await saveAll("offers", offers);
  res.json({ deleted: true, id: removed.id });
});

// ---------- Fallback: serve the frontend for any other route ----------
app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// Try MongoDB in the background; the server works with JSON files until
// (and unless) the connection succeeds.
connectMongo();

app.listen(PORT, () => {
  console.log(`Tuition Platform চলছে: http://localhost:${PORT}`);
});
