const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const TUTORS_FILE = path.join(DATA_DIR, "tutors.json");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

app.use(express.json());
app.use(express.static(FRONTEND_DIR));

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

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

// ---------- Health ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "tuition-platform", time: new Date().toISOString() });
});

// ---------- Tutors ----------
app.get("/api/tutors", (req, res) => {
  const { subject, class: cls, area, maxFee, q } = req.query;
  let tutors = readJson(TUTORS_FILE, []);

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

app.get("/api/tutors/:id", (req, res) => {
  const tutors = readJson(TUTORS_FILE, []);
  const tutor = tutors.find((t) => String(t.id) === String(req.params.id));
  if (!tutor) {
    return res.status(404).json({ error: "টিউটর পাওয়া যায়নি" });
  }
  res.json(tutor);
});

app.post("/api/tutors", (req, res) => {
  const body = req.body || {};
  const required = ["name", "phone", "university", "subjects", "classes", "areas", "monthlyFee"];
  const missing = required.filter(
    (key) => body[key] === undefined || body[key] === "" || (Array.isArray(body[key]) && body[key].length === 0)
  );
  if (missing.length > 0) {
    return res.status(400).json({ error: "এই তথ্যগুলো আবশ্যক: " + missing.join(", ") });
  }

  const tutors = readJson(TUTORS_FILE, []);
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
  writeJson(TUTORS_FILE, tutors);
  res.status(201).json(tutor);
});

// ---------- Tutor requests (students / parents) ----------
app.get("/api/requests", (req, res) => {
  res.json(readJson(REQUESTS_FILE, []));
});

app.post("/api/requests", (req, res) => {
  const body = req.body || {};
  const required = ["studentName", "phone", "class", "subjects", "area"];
  const missing = required.filter(
    (key) => body[key] === undefined || body[key] === "" || (Array.isArray(body[key]) && body[key].length === 0)
  );
  if (missing.length > 0) {
    return res.status(400).json({ error: "এই তথ্যগুলো আবশ্যক: " + missing.join(", ") });
  }

  const requests = readJson(REQUESTS_FILE, []);
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
  writeJson(REQUESTS_FILE, requests);
  res.status(201).json(request);
});

// ---------- Fallback: serve the frontend for any other route ----------
app.get("*", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Tuition Platform চলছে: http://localhost:${PORT}`);
});
