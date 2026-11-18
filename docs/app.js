// টিউশন প্লাটফর্ম — শেয়ার্ড ফ্রন্টএন্ড লজিক
// ব্যাকএন্ড (API) চালু থাকলে সেটা ব্যবহার করে, না থাকলে localStorage + বিল্ট-ইন তথ্য ব্যবহার করে।

const API_BASE = "/api";

const SUBJECTS = ["গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "ইংরেজি", "বাংলা", "আইসিটি", "হিসাববিজ্ঞান"];
const CLASSES = ["১ম-৫ম", "৬ষ্ঠ-৮ম", "৯ম-১০ম", "একাদশ-দ্বাদশ", "HSC", "ভর্তি পরীক্ষা"];
const AREAS = ["ধানমন্ডি", "মিরপুর", "উত্তরা", "বসুন্ধরা", "মোহাম্মদপুর", "গুলশান", "বনানী"];

// ব্যাকএন্ড না পাওয়া গেলে ব্যবহারের জন্য বিল্ট-ইন টিউটর তালিকা (সার্ভারের seed-এর মতোই)
const FALLBACK_TUTORS = [
  { id: 1, name: "তানভীর হাসান", university: "বুয়েট", department: "কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং", subjects: ["গণিত", "পদার্থবিজ্ঞান", "আইসিটি"], classes: ["৯ম-১০ম", "একাদশ-দ্বাদশ", "HSC"], areas: ["ধানমন্ডি", "মোহাম্মদপুর"], monthlyFee: 8000, experienceYears: 5, rating: 4.9, reviewsCount: 42, phone: "01711-234501", about: "বুয়েট সিএসই থেকে পাস করা তানভীর গত ৫ বছর ধরে গণিত ও পদার্থবিজ্ঞান পড়াচ্ছেন। HSC ও ভর্তি পরীক্ষার জন্য বিশেষ প্রস্তুতি নেন।", available: true, reviews: [{ name: "রাফি", class: "HSC", rating: 5, text: "স্যারের গণিত পড়ানোর ধরন অসাধারণ। কঠিন অধ্যায়ও সহজ লাগে।" }, { name: "নুসরাতের মা", class: "১০ম", rating: 5, text: "মেয়ের গণিতে এখন A+ আসছে। খুবই দায়িত্বশীল শিক্ষক।" }] },
  { id: 2, name: "ফারহানা আক্তার", university: "ঢাকা বিশ্ববিদ্যালয়", department: "ইংরেজি", subjects: ["ইংরেজি", "বাংলা"], classes: ["৬ষ্ঠ-৮ম", "৯ম-১০ম", "একাদশ-দ্বাদশ"], areas: ["মিরপুর", "উত্তরা"], monthlyFee: 5000, experienceYears: 4, rating: 4.8, reviewsCount: 35, phone: "01711-234502", about: "ঢাকা বিশ্ববিদ্যালয়ের ইংরেজি বিভাগের স্নাতক ফারহানা ইংরেজি গ্রামার ও রাইটিংয়ে বিশেষ দক্ষ।", available: true, reviews: [{ name: "সাকিব", class: "SSC", rating: 5, text: "আপু খুব ধৈর্য নিয়ে গ্রামার শেখান। ইংরেজিতে ভয় কেটে গেছে।" }] },
  { id: 3, name: "সাকিব আল হাসান", university: "ঢাকা মেডিকেল কলেজ", department: "এমবিবিএস", subjects: ["জীববিজ্ঞান", "রসায়ন"], classes: ["৯ম-১০ম", "একাদশ-দ্বাদশ", "ভর্তি পরীক্ষা"], areas: ["বসুন্ধরা", "উত্তরা"], monthlyFee: 9000, experienceYears: 3, rating: 4.9, reviewsCount: 28, phone: "01711-234503", about: "মেডিকেল শিক্ষার্থী সাকিব জীববিজ্ঞান ও রসায়নে গভীর জ্ঞান রাখেন। মেডিকেল ও ডেন্টাল ভর্তি পরীক্ষার প্রস্তুতিতে বিশেষজ্ঞ।", available: true, reviews: [{ name: "মাহি", class: "ভর্তি পরীক্ষা", rating: 5, text: "ভাইয়ার নোট আর মক টেস্ট মেডিকেল প্রস্তুতিতে অনেক কাজে দিয়েছে।" }] },
  { id: 4, name: "নুসরাত জাহান", university: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়", department: "গণিত", subjects: ["গণিত", "আইসিটি"], classes: ["১ম-৫ম", "৬ষ্ঠ-৮ম", "৯ম-১০ম"], areas: ["মোহাম্মদপুর", "ধানমন্ডি"], monthlyFee: 4000, experienceYears: 6, rating: 4.7, reviewsCount: 51, phone: "01711-234504", about: "৬ বছরের অভিজ্ঞতাসম্পন্ন নুসরাত ছোটদের গণিত শেখাতে খুবই পারদর্শী। খেলার ছলে গণিত শেখান, তাই বাচ্চারা পড়তে ভালোবাসে।", available: true, reviews: [{ name: "আরিফের মা", class: "৫ম", rating: 5, text: "ছেলে এখন নিজে থেকে অংক করতে চায়।" }] },
  { id: 5, name: "রাকিবুল ইসলাম", university: "বুয়েট", department: "ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং", subjects: ["পদার্থবিজ্ঞান", "গণিত", "আইসিটি"], classes: ["একাদশ-দ্বাদশ", "HSC", "ভর্তি পরীক্ষা"], areas: ["ধানমন্ডি", "গুলশান", "বনানী"], monthlyFee: 10000, experienceYears: 7, rating: 5.0, reviewsCount: 63, phone: "01711-234505", about: "৭ বছরের অভিজ্ঞতাসম্পন্ন রাকিবুল বুয়েট ভর্তি পরীক্ষার প্রস্তুতিতে বিশেষ খ্যাতি অর্জন করেছেন।", available: true, reviews: [{ name: "অর্ণব", class: "ভর্তি পরীক্ষা", rating: 5, text: "স্যারের গাইডলাইনে বুয়েটে চান্স পেয়েছি। সেরা শিক্ষক।" }] },
  { id: 6, name: "তাহসিনা রহমান", university: "নর্থ সাউথ বিশ্ববিদ্যালয়", department: "বিবিএ", subjects: ["হিসাববিজ্ঞান", "ইংরেজি", "গণিত"], classes: ["৯ম-১০ম", "একাদশ-দ্বাদশ", "HSC"], areas: ["বসুন্ধরা", "গুলশান"], monthlyFee: 6000, experienceYears: 4, rating: 4.8, reviewsCount: 22, phone: "01711-234506", about: "বাণিজ্য শাখার শিক্ষার্থীদের জন্য হিসাববিজ্ঞান ও ফিন্যান্স পড়ান তাহসিনা।", available: true, reviews: [{ name: "রিফাত", class: "HSC", rating: 5, text: "হিসাববিজ্ঞানের জটিল বিষয়গুলো আপু খুব সহজ করে বোঝান।" }] },
  { id: 7, name: "মেহেদী হাসান", university: "চট্টগ্রাম বিশ্ববিদ্যালয়", department: "রসায়ন", subjects: ["রসায়ন", "জীববিজ্ঞান"], classes: ["৯ম-১০ম", "একাদশ-দ্বাদশ", "HSC"], areas: ["মিরপুর", "মোহাম্মদপুর"], monthlyFee: 5500, experienceYears: 5, rating: 4.6, reviewsCount: 30, phone: "01711-234507", about: "রসায়নের জটিল সমীকরণ ও বিক্রিয়া সহজ উদাহরণ দিয়ে বোঝান মেহেদী।", available: true, reviews: [{ name: "সাব্বির", class: "১০ম", rating: 5, text: "রসায়ন এখন আর কঠিন লাগে না।" }] },
  { id: 8, name: "সানজিদা আক্তার", university: "ঢাকা বিশ্ববিদ্যালয়", department: "বাংলা", subjects: ["বাংলা", "ইংরেজি"], classes: ["১ম-৫ম", "৬ষ্ঠ-৮ম", "৯ম-১০ম"], areas: ["উত্তরা", "মিরপুর"], monthlyFee: 3500, experienceYears: 3, rating: 4.7, reviewsCount: 19, phone: "01711-234508", about: "ছোটদের বাংলা ও ইংরেজি পড়াতে ভালোবাসেন সানজিদা। হাতের লেখা, বানান ও রচনা শেখাতে বিশেষ যত্ন নেন।", available: false, reviews: [{ name: "আয়েশার মা", class: "৩য়", rating: 5, text: "মেয়ের হাতের লেখা অনেক সুন্দর হয়েছে।" }] }
];

// ---------- স্থানীয় সংরক্ষণ (অফলাইন ফলব্যাক) ----------
function localTutors() {
  try {
    return JSON.parse(localStorage.getItem("tp_local_tutors") || "[]");
  } catch (e) {
    return [];
  }
}

function allLocalTutors() {
  return applyLocalChanges("tutors", [...FALLBACK_TUTORS, ...localTutors()]);
}

// ---------- অ্যাডমিনের স্থানীয় পরিবর্তন (স্ট্যাটিক সাইটে) ----------
// ব্যাকএন্ড না থাকলে অ্যাডমিনের মুছে ফেলা / স্ট্যাটাস বদলানো এখানে সংরক্ষিত হয়
const ADMIN_KIND_KEYS = {
  tutors: { deleted: "tp_admin_deleted_tutors", overrides: "tp_admin_overrides_tutors", local: "tp_local_tutors" },
  offers: { deleted: "tp_admin_deleted_offers", overrides: "tp_admin_overrides_offers", local: "tp_local_offers" },
  requests: { deleted: "tp_admin_deleted_requests", overrides: "tp_admin_overrides_requests", local: "tp_local_requests" }
};

function readAdminList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}

function readAdminMap(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch (e) {
    return {};
  }
}

// মুছে ফেলা আইটেম বাদ দিন ও সংরক্ষিত স্ট্যাটাস/পরিবর্তন প্রয়োগ করুন
function applyLocalChanges(kind, items) {
  const keys = ADMIN_KIND_KEYS[kind];
  const deleted = new Set(readAdminList(keys.deleted).map(String));
  const overrides = readAdminMap(keys.overrides);
  return items
    .filter((item) => !deleted.has(String(item.id)))
    .map((item) => (overrides[String(item.id)] ? { ...item, ...overrides[String(item.id)] } : item));
}

function removeLocalItem(kind, id) {
  const keys = ADMIN_KIND_KEYS[kind];
  localStorage.setItem(keys.local, JSON.stringify(readAdminList(keys.local).filter((x) => String(x.id) !== String(id))));
}

function saveLocalItem(kind, item) {
  const keys = ADMIN_KIND_KEYS[kind];
  const local = readAdminList(keys.local);
  const i = local.findIndex((x) => String(x.id) === String(item.id));
  if (i >= 0) local[i] = item;
  else local.push(item);
  localStorage.setItem(keys.local, JSON.stringify(local));
}

function filterTutors(tutors, f) {
  return tutors.filter((t) => {
    if (f.subject && !t.subjects.includes(f.subject)) return false;
    if (f.class && !t.classes.includes(f.class)) return false;
    if (f.area && !t.areas.includes(f.area)) return false;
    if (f.maxFee && t.monthlyFee > Number(f.maxFee)) return false;
    if (f.q) {
      const hay = [t.name, t.university, t.about, ...t.subjects, ...t.areas].join(" ").toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    return true;
  });
}

async function fetchTutors(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  try {
    const res = await fetch(`${API_BASE}/tutors?${params.toString()}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return filterTutors(allLocalTutors(), filters);
  }
}

async function fetchTutor(id) {
  try {
    const res = await fetch(`${API_BASE}/tutors/${id}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return allLocalTutors().find((t) => String(t.id) === String(id)) || null;
  }
}

async function postJson(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "সার্ভার ত্রুটি");
  }
  return res.json();
}

// ---------- টিউটর কার্ড ----------
function stars(rating) {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}

function tutorCardHTML(t) {
  const initials = t.name.trim().charAt(0);
  const badge = t.available
    ? '<span class="badge available">উপলব্ধ</span>'
    : '<span class="badge busy">এই মুহূর্তে ব্যস্ত</span>';
  return `
  <article class="tutor-card" data-id="${t.id}" tabindex="0">
    <div class="tutor-top">
      <div class="avatar">${initials}</div>
      <div>
        <div class="tutor-name">${t.name}</div>
        <div class="tutor-uni">${t.university}${t.department ? " • " + t.department : ""}</div>
        <div><span class="rating">${stars(t.rating)} ${t.rating.toFixed(1)}</span> <span class="muted">(${t.reviewsCount} রিভিউ)</span></div>
      </div>
    </div>
    <p style="margin:10px 0 6px">${t.subjects.map((s) => `<span class="tag">${s}</span>`).join("")}</p>
    <p class="muted" style="margin:4px 0">শ্রেণি: ${t.classes.join(", ")}</p>
    <p class="muted" style="margin:4px 0">এলাকা: ${t.areas.join(", ")} • অভিজ্ঞতা: ${t.experienceYears} বছর</p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
      <span class="fee">৳${t.monthlyFee.toLocaleString("bn-BD")}/মাস</span>
      ${badge}
    </div>
  </article>`;
}

function renderTutorCards(container, tutors) {
  if (!tutors.length) {
    container.innerHTML = '<p class="empty">কোনো টিউটর পাওয়া যায়নি। ফিল্টার বদলে আবার চেষ্টা করুন।</p>';
    return;
  }
  container.innerHTML = tutors.map(tutorCardHTML).join("");
  container.querySelectorAll(".tutor-card").forEach((card) => {
    const open = () => openTutorModal(card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") open();
    });
  });
}

// ---------- টিউটর প্রোফাইল মডাল ----------
async function openTutorModal(id) {
  const t = await fetchTutor(id);
  if (!t) return;
  const existing = document.querySelector(".modal-backdrop");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-label="টিউটর প্রোফাইল">
      <button class="modal-close" aria-label="বন্ধ করুন">✕</button>
      <div class="tutor-top">
        <div class="avatar">${t.name.trim().charAt(0)}</div>
        <div>
          <div class="tutor-name" style="font-size:1.3rem">${t.name}</div>
          <div class="tutor-uni">${t.university}${t.department ? " • " + t.department : ""}</div>
          <div><span class="rating">${stars(t.rating)} ${t.rating.toFixed(1)}</span> <span class="muted">(${t.reviewsCount} রিভিউ • ${t.experienceYears} বছরের অভিজ্ঞতা)</span></div>
        </div>
      </div>
      <p style="margin-top:14px">${t.about || ""}</p>
      <p><strong>বিষয়:</strong> ${t.subjects.map((s) => `<span class="tag">${s}</span>`).join("")}</p>
      <p><strong>শ্রেণি:</strong> ${t.classes.join(", ")}</p>
      <p><strong>এলাকা:</strong> ${t.areas.join(", ")}</p>
      <p><strong>মাসিক ফি:</strong> <span class="fee">৳${t.monthlyFee.toLocaleString("bn-BD")}</span></p>
      <p><strong>ফোন:</strong> <a href="tel:${t.phone.replace(/[^0-9+]/g, "")}">${t.phone}</a></p>
      <p>${t.available ? '<span class="badge available">এখন টিউশন নিতে পারবেন</span>' : '<span class="badge busy">এই মুহূর্তে নতুন শিক্ষার্থী নিচ্ছেন না</span>'}</p>
      <h3 style="margin-top:20px">শিক্ষার্থীদের রিভিউ</h3>
      ${(t.reviews || []).length
        ? t.reviews.map((r) => `<div class="review"><div class="who">${r.name} <span class="muted">(${r.class})</span></div><div class="stars">${stars(r.rating)}</div><div>${r.text}</div></div>`).join("")
        : '<p class="muted">এখনো কোনো রিভিউ নেই।</p>'}
      <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn" href="request.html">টিউটরের জন্য অনুরোধ করুন</a>
        <a class="btn secondary" href="tel:${t.phone.replace(/[^0-9+]/g, "")}">ফোন করুন</a>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  backdrop.querySelector(".modal-close").addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", esc);
    }
  });
}

// ---------- হেল্পার ----------
function fillSelect(select, items, placeholder) {
  if (!select) return;
  select.innerHTML = `<option value="">${placeholder}</option>` + items.map((v) => `<option value="${v}">${v}</option>`).join("");
}

function checkedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((el) => el.value);
}

function showNotice(el, message, type) {
  if (!el) return;
  el.className = "notice " + type;
  el.textContent = message;
  el.hidden = false;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- টিউশন অফার ----------
// ব্যাকএন্ড না পাওয়া গেলে ব্যবহারের জন্য বিল্ট-ইন অফার তালিকা (সার্ভারের seed-এর মতোই)
const FALLBACK_OFFERS = [
  { id: 1, teacherGender: "male", preferredDepartment: "পদার্থবিজ্ঞান", location: "Stadium Gate, ময়মনসিংহ সদর", class: "SSC 27", subjects: ["পদার্থবিজ্ঞান", "জীববিজ্ঞান", "রসায়ন"], studentCount: 1, salary: 3000, daysPerWeek: 3, durationPerDay: "১ ঘণ্টা+", mediaFee: "প্রযোজ্য", posterName: "আরিফের বাবা", phone: "01711-234511", notes: "ইনবক্সে শর্ট সিভি, অভিজ্ঞতা, স্টুডেন্ট আইডি কার্ড ও নম্বর দিয়ে মেসেজ দিন।", status: "খোলা", createdAt: "2026-11-18T10:00:00.000Z" },
  { id: 2, teacherGender: "female", preferredDepartment: "ইংরেজি", location: "ধানমন্ডি ২৭, ঢাকা", class: "HSC 26", subjects: ["ইংরেজি", "আইসিটি"], studentCount: 2, salary: 5000, daysPerWeek: 4, durationPerDay: "১.৫ ঘণ্টা", mediaFee: "প্রযোজ্য", posterName: "নুসরাতের মা", phone: "01711-234512", notes: "দুই বোন একসাথে পড়বে। ইংরেজি গ্রামার ও রাইটিংয়ে দক্ষ শিক্ষিকা চাই। ইনবক্সে সিভি ও অভিজ্ঞতা পাঠান।", status: "খোলা", createdAt: "2026-11-18T10:05:00.000Z" },
  { id: 3, teacherGender: "any", preferredDepartment: "গণিত", location: "মিরপুর ১০, ঢাকা", class: "৯ম শ্রেণি", subjects: ["গণিত", "পদার্থবিজ্ঞান"], studentCount: 1, salary: 4000, daysPerWeek: 3, durationPerDay: "১ ঘণ্টা", mediaFee: "প্রযোজ্য নয়", posterName: "সাব্বিরের বাবা", phone: "01711-234513", notes: "সপ্তাহে ৩ দিন, বিকাল ৪টা থেকে। গণিতে দুর্বল অধ্যায়গুলোতে বিশেষ যত্ন নিতে হবে।", status: "খোলা", createdAt: "2026-11-18T10:10:00.000Z" },
  { id: 4, teacherGender: "male", preferredDepartment: "রসায়ন", location: "উত্তরা সেক্টর ৪, ঢাকা", class: "একাদশ শ্রেণি", subjects: ["রসায়ন", "জীববিজ্ঞান"], studentCount: 1, salary: 6000, daysPerWeek: 5, durationPerDay: "১ ঘণ্টা", mediaFee: "প্রযোজ্য", posterName: "মাহির মা", phone: "01711-234514", notes: "মেডিকেল ভর্তি পরীক্ষার প্রস্তুতিসহ পড়াতে হবে। ইনবক্সে শর্ট সিভি ও স্টুডেন্ট আইডি কার্ড পাঠান।", status: "খোলা", createdAt: "2026-11-18T10:15:00.000Z" },
  { id: 5, teacherGender: "female", preferredDepartment: "বাংলা", location: "গাঙ্গিনার পাড়, ময়মনসিংহ সদর", class: "৬ষ্ঠ শ্রেণি", subjects: ["বাংলা", "ইংরেজি", "গণিত"], studentCount: 1, salary: 2500, daysPerWeek: 4, durationPerDay: "১ ঘণ্টা", mediaFee: "প্রযোজ্য নয়", posterName: "আয়েশার মা", phone: "01711-234515", notes: "ছোট মেয়ের জন্য ধৈর্যশীল শিক্ষিকা চাই। হাতের লেখা ও বানানে বিশেষ যত্ন নিতে হবে।", status: "খোলা", createdAt: "2026-11-18T10:20:00.000Z" }
];

function genderLabel(gender) {
  if (gender === "male") return "শুধু পুরুষ";
  if (gender === "female") return "শুধু মহিলা";
  return "যেকোনো";
}

function localOffers() {
  try {
    return JSON.parse(localStorage.getItem("tp_local_offers") || "[]");
  } catch (e) {
    return [];
  }
}

function allLocalOffers() {
  const local = localOffers();
  const fallbackIds = new Set(FALLBACK_OFFERS.map((o) => String(o.id)));
  const merged = [...FALLBACK_OFFERS];
  local.forEach((o) => {
    if (!fallbackIds.has(String(o.id))) merged.push(o);
  });
  return applyLocalChanges("offers", merged);
}

function filterOffers(offers, f) {
  return offers.filter((o) => {
    if (f.subject && !o.subjects.includes(f.subject)) return false;
    if (f.class && !o.class.toLowerCase().includes(f.class.toLowerCase())) return false;
    if (f.location && !o.location.toLowerCase().includes(f.location.toLowerCase())) return false;
    if (f.minSalary && o.salary < Number(f.minSalary)) return false;
    if (f.gender && o.teacherGender !== f.gender && o.teacherGender !== "any") return false;
    if (f.q) {
      const hay = [o.location, o.class, o.preferredDepartment, o.posterName, o.notes, ...o.subjects].join(" ").toLowerCase();
      if (!hay.includes(f.q.toLowerCase())) return false;
    }
    return true;
  });
}

async function fetchOffers(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  try {
    const res = await fetch(`${API_BASE}/offers?${params.toString()}`);
    if (!res.ok) throw new Error("API error");
    const fromApi = await res.json();
    // API-তে না থাকা স্থানীয় অফারগুলোও দেখান (অফলাইন ফলব্যাক)
    const apiIds = new Set(fromApi.map((o) => String(o.id)));
    const extra = localOffers().filter((o) => !apiIds.has(String(o.id)));
    return filterOffers([...fromApi, ...extra], filters);
  } catch (e) {
    return filterOffers(allLocalOffers(), filters);
  }
}

async function fetchOffer(id) {
  try {
    const res = await fetch(`${API_BASE}/offers/${id}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return allLocalOffers().find((o) => String(o.id) === String(id)) || null;
  }
}

// ---------- টিউটরের অনুরোধ (অ্যাডমিনের জন্য) ----------
// ব্যাকএন্ড না পাওয়া গেলে ব্যবহারের জন্য বিল্ট-ইন অনুরোধ তালিকা (সার্ভারের seed-এর মতোই)
const FALLBACK_REQUESTS = [
  { id: 1, studentName: "রাফি হাসান", guardianName: "করিম হোসেন", phone: "01711-234521", class: "৯ম শ্রেণি", subjects: ["গণিত", "পদার্থবিজ্ঞান"], area: "মিরপুর", budget: 4500, preferredTime: "বিকাল (৪টা–৬টা)", notes: "সপ্তাহে ৪ দিন, গণিতের দুর্বল অধ্যায়গুলোতে বিশেষ যত্ন নিতে হবে।", status: "নতুন", createdAt: "2026-11-18T10:30:00.000Z" },
  { id: 2, studentName: "নুসরাত জাহান", guardianName: "আবদুল করিম", phone: "01711-234522", class: "HSC 26", subjects: ["ইংরেজি", "আইসিটি"], area: "ধানমন্ডি", budget: 6000, preferredTime: "সন্ধ্যা (৬টা–৯টা)", notes: "ইংরেজি রাইটিংয়ে দুর্বল, গ্রামারসহ পড়াতে হবে।", status: "নতুন", createdAt: "2026-11-18T10:35:00.000Z" },
  { id: 3, studentName: "তানজিলা আক্তার", guardianName: "মোঃ রফিক", phone: "01711-234523", class: "SSC 27", subjects: ["রসায়ন", "জীববিজ্ঞান"], area: "ময়মনসিংহ সদর", budget: 3500, preferredTime: "সকাল (৭টা–১০টা)", notes: "মেডিকেল ভর্তি পরীক্ষার প্রস্তুতিসহ পড়াতে হবে।", status: "যোগাযোগ হয়েছে", createdAt: "2026-11-18T10:40:00.000Z" }
];

function localRequests() {
  try {
    return JSON.parse(localStorage.getItem("tp_local_requests") || "[]");
  } catch (e) {
    return [];
  }
}

function allLocalRequests() {
  const local = localRequests();
  const fallbackIds = new Set(FALLBACK_REQUESTS.map((r) => String(r.id)));
  const merged = [...FALLBACK_REQUESTS];
  local.forEach((r) => {
    if (!fallbackIds.has(String(r.id))) merged.push(r);
  });
  return applyLocalChanges("requests", merged);
}

async function fetchRequests() {
  try {
    const res = await fetch(`${API_BASE}/requests`);
    if (!res.ok) throw new Error("API error");
    const fromApi = await res.json();
    const apiIds = new Set(fromApi.map((r) => String(r.id)));
    const extra = localRequests().filter((r) => !apiIds.has(String(r.id)));
    return [...fromApi, ...extra];
  } catch (e) {
    return allLocalRequests();
  }
}

async function fetchRequest(id) {
  try {
    const res = await fetch(`${API_BASE}/requests/${id}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return allLocalRequests().find((r) => String(r.id) === String(id)) || null;
  }
}

// ---------- অ্যাডমিন অ্যাকশন (API থাকলে সার্ভারে, না থাকলে স্থানীয়ভাবে) ----------
async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "সার্ভার ত্রুটি");
  }
  return res.json();
}

async function apiPatch(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "সার্ভার ত্রুটি");
  }
  return res.json();
}

// kind: "tutors" | "offers" | "requests" — ফেরত: "server" বা "local"
async function adminDelete(kind, id) {
  const path = kind === "tutors" ? `/tutors/${id}` : kind === "offers" ? `/offers/${id}` : `/requests/${id}`;
  try {
    await apiDelete(path);
    removeLocalItem(kind, id);
    return "server";
  } catch (e) {
    const keys = ADMIN_KIND_KEYS[kind];
    const deleted = readAdminList(keys.deleted);
    if (!deleted.map(String).includes(String(id))) {
      deleted.push(id);
      localStorage.setItem(keys.deleted, JSON.stringify(deleted));
    }
    removeLocalItem(kind, id);
    return "local";
  }
}

// ফেরত: { where: "server" | "local", item }
async function adminPatch(kind, id, patch) {
  const path = kind === "tutors" ? `/tutors/${id}` : kind === "offers" ? `/offers/${id}` : `/requests/${id}`;
  try {
    const updated = await apiPatch(path, patch);
    const local = readAdminList(ADMIN_KIND_KEYS[kind].local);
    const i = local.findIndex((x) => String(x.id) === String(id));
    if (i >= 0) {
      local[i] = { ...local[i], ...patch };
      localStorage.setItem(ADMIN_KIND_KEYS[kind].local, JSON.stringify(local));
    }
    return { where: "server", item: updated };
  } catch (e) {
    const keys = ADMIN_KIND_KEYS[kind];
    const overrides = readAdminMap(keys.overrides);
    overrides[String(id)] = { ...(overrides[String(id)] || {}), ...patch };
    localStorage.setItem(keys.overrides, JSON.stringify(overrides));
    const local = readAdminList(keys.local);
    const i = local.findIndex((x) => String(x.id) === String(id));
    if (i >= 0) {
      local[i] = { ...local[i], ...patch };
      localStorage.setItem(keys.local, JSON.stringify(local));
    }
    return { where: "local", item: null };
  }
}

function offerCardHTML(o) {
  const genderBadge = o.teacherGender === "male"
    ? '<span class="badge gender-male">👨 শুধু পুরুষ</span>'
    : o.teacherGender === "female"
    ? '<span class="badge gender-female">👩 শুধু মহিলা</span>'
    : '<span class="badge gender-any">যেকোনো</span>';
  const mediaBadge = o.mediaFee === "প্রযোজ্য"
    ? '<span class="badge media-yes">মিডিয়া ফি প্রযোজ্য</span>'
    : '<span class="badge media-no">মিডিয়া ফি প্রযোজ্য নয়</span>';
  return `
  <article class="offer-card" data-id="${o.id}" tabindex="0">
    <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
      ${genderBadge}
      ${mediaBadge}
    </div>
    <div class="offer-title">📍 ${escapeHtml(o.location)}</div>
    <p class="offer-line"><strong>শ্রেণি:</strong> ${escapeHtml(o.class)}</p>
    <p style="margin:6px 0">${o.subjects.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</p>
    <p class="offer-line"><strong>শিক্ষার্থী:</strong> ${o.studentCount} জন • <strong>সপ্তাহে:</strong> ${o.daysPerWeek} দিন • <strong>সময়:</strong> ${escapeHtml(o.durationPerDay)}</p>
    ${o.preferredDepartment ? `<p class="offer-line"><strong>পছন্দের বিভাগ:</strong> ${escapeHtml(o.preferredDepartment)} বিভাগ</p>` : ""}
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
      <span class="fee">৳${Number(o.salary).toLocaleString("bn-BD")}/মাস</span>
      <span class="muted">বিস্তারিত দেখুন →</span>
    </div>
  </article>`;
}

function renderOfferCards(container, offers) {
  if (!offers.length) {
    container.innerHTML = '<p class="empty">কোনো অফার পাওয়া যায়নি। ফিল্টার বদলে আবার চেষ্টা করুন।</p>';
    return;
  }
  container.innerHTML = offers.map(offerCardHTML).join("");
  container.querySelectorAll(".offer-card").forEach((card) => {
    const open = () => openOfferModal(card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") open();
    });
  });
}

// ---------- অফারের বিস্তারিত মডাল ----------
async function openOfferModal(id) {
  const o = await fetchOffer(id);
  if (!o) return;
  const existing = document.querySelector(".modal-backdrop");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-label="টিউশন অফারের বিস্তারিত">
      <button class="modal-close" aria-label="বন্ধ করুন">✕</button>
      <h2 style="margin-top:0">📍 ${escapeHtml(o.location)}</h2>
      <p>
        <span class="badge ${o.teacherGender === "male" ? "gender-male" : o.teacherGender === "female" ? "gender-female" : "gender-any"}">${o.teacherGender === "male" ? "👨 শুধু পুরুষ" : o.teacherGender === "female" ? "👩 শুধু মহিলা" : "যেকোনো"}</span>
        <span class="badge ${o.mediaFee === "প্রযোজ্য" ? "media-yes" : "media-no"}">মিডিয়া ফি ${escapeHtml(o.mediaFee)}</span>
        <span class="badge available">${escapeHtml(o.status || "খোলা")}</span>
      </p>
      <p><strong>শ্রেণি:</strong> ${escapeHtml(o.class)}</p>
      <p><strong>বিষয়:</strong> ${o.subjects.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</p>
      ${o.preferredDepartment ? `<p><strong>পছন্দের বিভাগ:</strong> ${escapeHtml(o.preferredDepartment)} বিভাগের শিক্ষক অগ্রাধিকার পাবেন</p>` : ""}
      <p><strong>শিক্ষার্থী:</strong> ${o.studentCount} জন</p>
      <p><strong>সাপ্তাহিক রুটিন:</strong> সপ্তাহে ${o.daysPerWeek} দিন, প্রতিদিন ${escapeHtml(o.durationPerDay)}</p>
      <p><strong>বেতন:</strong> <span class="fee">৳${Number(o.salary).toLocaleString("bn-BD")}/মাস</span></p>
      ${o.posterName ? `<p><strong>পোস্ট করেছেন:</strong> ${escapeHtml(o.posterName)}</p>` : ""}
      ${o.phone ? `<p><strong>ফোন:</strong> <a href="tel:${o.phone.replace(/[^0-9+]/g, "")}">${escapeHtml(o.phone)}</a></p>` : ""}
      ${o.notes ? `<h3 style="margin-top:20px">কীভাবে আবেদন করবেন</h3><p>${escapeHtml(o.notes)}</p>` : ""}
      <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap">
        ${o.phone ? `<a class="btn" href="tel:${o.phone.replace(/[^0-9+]/g, "")}">ফোন করুন</a>` : ""}
        <a class="btn secondary" href="register.html">টিউটর হিসেবে যোগ দিন</a>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  backdrop.querySelector(".modal-close").addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", esc);
    }
  });
}

// ---------- অ্যাডমিন টেবিল ----------
// টেবিলের সারি (tbody-তে বসানোর মতো HTML) তৈরি করে; অ্যাকশন বোতামগুলো data-action / data-id ধরে
function adminTutorRowHTML(t) {
  return `<tr data-id="${t.id}">
    <td><strong>${escapeHtml(t.name)}</strong><br><span class="muted">${escapeHtml(t.university)}${t.department ? " • " + escapeHtml(t.department) : ""}</span></td>
    <td>${t.subjects.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</td>
    <td>${t.areas.map((a) => escapeHtml(a)).join(", ")}</td>
    <td><span class="fee" style="font-size:1rem">৳${Number(t.monthlyFee).toLocaleString("bn-BD")}</span></td>
    <td><span class="rating">${stars(t.rating || 5)} ${(t.rating || 5).toFixed(1)}</span></td>
    <td>${t.available ? '<span class="badge available">উপলব্ধ</span>' : '<span class="badge busy">ব্যস্ত</span>'}</td>
    <td class="actions">
      <button class="btn-small" data-action="view-tutor" data-id="${t.id}" type="button">দেখুন</button>
      <button class="btn-small secondary" data-action="toggle-tutor" data-id="${t.id}" type="button">${t.available ? "ব্যস্ত করুন" : "উপলব্ধ করুন"}</button>
      <button class="btn-small danger" data-action="delete-tutor" data-id="${t.id}" type="button">মুছুন</button>
    </td>
  </tr>`;
}

function adminOfferRowHTML(o) {
  return `<tr data-id="${o.id}">
    <td><strong>📍 ${escapeHtml(o.location)}</strong><br><span class="muted">${escapeHtml(o.posterName || "")}</span></td>
    <td>${escapeHtml(o.class)}</td>
    <td>${o.subjects.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</td>
    <td><span class="fee" style="font-size:1rem">৳${Number(o.salary).toLocaleString("bn-BD")}</span></td>
    <td>${genderLabel(o.teacherGender)}</td>
    <td>${o.mediaFee === "প্রযোজ্য" ? '<span class="badge media-yes">প্রযোজ্য</span>' : '<span class="badge media-no">প্রযোজ্য নয়</span>'}</td>
    <td>${o.status === "বন্ধ" ? '<span class="badge busy">বন্ধ</span>' : '<span class="badge available">খোলা</span>'}</td>
    <td class="actions">
      <button class="btn-small" data-action="view-offer" data-id="${o.id}" type="button">দেখুন</button>
      <button class="btn-small secondary" data-action="toggle-offer" data-id="${o.id}" type="button">${o.status === "বন্ধ" ? "খুলুন" : "বন্ধ করুন"}</button>
      <button class="btn-small danger" data-action="delete-offer" data-id="${o.id}" type="button">মুছুন</button>
    </td>
  </tr>`;
}

function adminRequestRowHTML(r) {
  const statusBadge = r.status === "সম্পন্ন"
    ? '<span class="badge available">সম্পন্ন</span>'
    : r.status === "যোগাযোগ হয়েছে"
    ? '<span class="badge media-yes">যোগাযোগ হয়েছে</span>'
    : '<span class="badge gender-any">নতুন</span>';
  return `<tr data-id="${r.id}">
    <td><strong>${escapeHtml(r.studentName)}</strong><br><span class="muted">${escapeHtml(r.guardianName || "")} • <a href="tel:${String(r.phone || "").replace(/[^0-9+]/g, "")}">${escapeHtml(r.phone || "")}</a></span></td>
    <td>${escapeHtml(r.class)}</td>
    <td>${(r.subjects || []).map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</td>
    <td>${escapeHtml(r.area)}</td>
    <td>${r.budget ? "৳" + Number(r.budget).toLocaleString("bn-BD") : "—"}</td>
    <td>${escapeHtml(r.preferredTime || "—")}</td>
    <td>${statusBadge}</td>
    <td class="actions">
      <button class="btn-small" data-action="view-request" data-id="${r.id}" type="button">দেখুন</button>
      <button class="btn-small secondary" data-action="status-request" data-id="${r.id}" type="button">স্ট্যাটাস</button>
      <button class="btn-small danger" data-action="delete-request" data-id="${r.id}" type="button">মুছুন</button>
    </td>
  </tr>`;
}

// tbody-তে সারি বসান; খালি হলে বার্তা দেখান
function renderAdminRows(tbody, rowsHtml, emptyText) {
  if (!tbody) return;
  if (!rowsHtml.length) {
    const colCount = tbody.closest("table") ? tbody.closest("table").querySelectorAll("thead th").length : 1;
    tbody.innerHTML = `<tr><td colspan="${colCount}"><p class="empty">${escapeHtml(emptyText)}</p></td></tr>`;
    return;
  }
  tbody.innerHTML = rowsHtml.join("");
}
