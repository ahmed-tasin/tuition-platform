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
  return [...FALLBACK_TUTORS, ...localTutors()];
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
