# tuition-platform

Tuition platform — বাংলাদেশের অভিভাবক ও শিক্ষার্থীদের সাথে যাচাইকৃত টিউটরদের সংযোগের একটি সম্পূর্ণ টিউশন মিডিয়া প্লাটফর্ম।

## বৈশিষ্ট্য

- **হোম পেজ** — হিরো, বিষয়/শ্রেণি/এলাকা/বাজেট দিয়ে খোঁজা, সেরা টিউটর
- **টিউটর তালিকা** — লাইভ সার্চ ও ফিল্টার (বিষয়, শ্রেণি, এলাকা, সর্বোচ্চ ফি), রেটিং ও মাসিক ফিসহ কার্ড
- **টিউটর প্রোফাইল** — শিক্ষাগত যোগ্যতা, অভিজ্ঞতা, ফি, ফোন নম্বর ও শিক্ষার্থীদের রিভিউ (মডাল ভিউ)
- **টিউটর চাই** — শিক্ষার্থী/অভিভাবকের অনুরোধ ফর্ম (শ্রেণি, বিষয়, এলাকা, বাজেট, পছন্দের সময়)
- **টিউটর নিবন্ধন** — নতুন টিউটরের রেজিস্ট্রেশন ফর্ম, জমা দিলে প্রোফাইল তালিকায় যুক্ত হয়
- **টিউশন অফার** — অভিভাবক/শিক্ষার্থীদের পোস্ট করা টিউশনির অফার: শিক্ষকের লিঙ্গ পছন্দ, পছন্দের বিভাগ, লোকেশন, শ্রেণি, বিষয়, শিক্ষার্থীর সংখ্যা, বেতন, সাপ্তাহিক রুটিন ও মিডিয়া ফিসহ কার্ড; বিষয়/শ্রেণি/এলাকা/বেতন/লিঙ্গ দিয়ে লাইভ ফিল্টার; বিস্তারিত দেখে আবেদনের নির্দেশনা (সিভি, অভিজ্ঞতা, স্টুডেন্ট আইডি কার্ড ও ফোন নম্বর)
- **অফার পোস্ট করা (শুধু অ্যাডমিন)** — নতুন টিউশনির অফার শুধু অ্যাডমিন প্যানেল থেকে পোস্ট করা যায় (অ্যাডমিন প্যানেল → অফারসমূহ → অফার যোগ করুন); সাধারণ দর্শকদের জন্য `post-offer.html` এখন শুধু একটি বিজ্ঞপ্তি পাতা
- **অ্যাডমিন প্যানেল** (`admin.html`) — পাসকোড দিয়ে লগইন (ডিফল্ট পাসকোড: `admin123`, সেটিংস থেকে বদলানো যায়); ড্যাশবোর্ডে মোট টিউটর/অফার/অনুরোধ ও খোলা অফারের পরিসংখ্যান এবং সাম্প্রতিক তালিকা; টিউটরদের উপলব্ধ/ব্যস্ত করা ও মুছে ফেলা; অফার যোগ করা, অফারের স্ট্যাটাস (খোলা/বন্ধ) বদলানো ও মুছে ফেলা; অনুরোধের স্ট্যাটাস (নতুন/যোগাযোগ হয়েছে/সম্পন্ন) বদলানো ও মুছে ফেলা। এটি একটি সহজ ক্লায়েন্ট-সাইড পাসকোড গেট — ব্যাংক-মানের নিরাপত্তা নয়। লাইভ স্ট্যাটিক সাইটে পরিবর্তন শুধু ব্রাউজারে (localStorage-এ) সংরক্ষিত হয়; ব্যাকএন্ড চালু থাকলে সার্ভারে সংরক্ষিত হয়।
- **বাংলা-প্রথম UI** — পুরো ইন্টারফেস বাংলায়, মোবাইল-বান্ধব ডিজাইন
- **অফলাইন ফলব্যাক** — ব্যাকএন্ড না চললে ফ্রন্টএন্ড localStorage ব্যবহার করে কাজ চালিয়ে যায়
- **MongoDB ডাটাবেইজ** — `MONGODB_URI` দিলে সব তথ্য MongoDB Atlas-এ সংরক্ষিত হয়; না দিলে JSON ফাইলেই কাজ চলে (নিচে দেখুন)

## ফোল্ডার কাঠামো

```
tuition-platform/
├── README.md
├── frontend/                 # স্ট্যাটিক ফ্রন্টএন্ড (কোনো build ধাপ লাগে না)
│   ├── index.html            # হোম পেজ
│   ├── tutors.html           # টিউটর তালিকা ও ফিল্টার
│   ├── offers.html           # টিউশন অফার তালিকা ও ফিল্টার
│   ├── post-offer.html       # বিজ্ঞপ্তি পাতা — অফার পোস্ট করা যায় শুধু অ্যাডমিন প্যানেল থেকে
│   ├── request.html          # টিউটরের অনুরোধ ফর্ম
│   ├── register.html         # টিউটর নিবন্ধন ফর্ম
│   ├── admin.html            # অ্যাডমিন প্যানেল (পাসকোড গেট, ড্যাশবোর্ড, ব্যবস্থাপনা)
│   ├── app.js                # API কল, ফিল্টার, প্রোফাইল/অফার মডাল, ফলব্যাক লজিক, অ্যাডমিন হেল্পার
│   ├── config.js             # API_BASE সেটিং — হোস্ট করা ব্যাকএন্ডের URL এখানে বসান
│   └── styles.css            # ডিজাইন
├── render.yaml               # Render-এ ব্যাকএন্ড হোস্ট করার ব্লুপ্রিন্ট (ফ্রি)
└── backend/                  # Node.js + Express API + MongoDB (Mongoose)
    ├── server.js             # REST API + ফ্রন্টএন্ড সার্ভ
    ├── db.js                 # MongoDB সংযোগ (ব্যর্থ হলে JSON ফলব্যাক)
    ├── models.js             # Tutor / Offer / Request স্কিমা
    ├── .env.example          # MONGODB_URI-এর নমুনা (আসল .env কখনো কমিট করবেন না)
    ├── scripts/
    │   └── seed-mongo.js     # JSON ফাইলের সিড তথ্য MongoDB-তে তোলার স্ক্রিপ্ট
    ├── package.json
    ├── .gitignore
    └── data/                 # JSON ফলব্যাক স্টোরেজ (MONGODB_URI না থাকলে ব্যবহৃত হয়)
        ├── tutors.json       # ৮ জন সিড টিউটর
        ├── offers.json       # ৫টি সিড টিউশন অফার
        └── requests.json     # ৩টি সিড অনুরোধ
```

## স্থানীয়ভাবে চালানো

```bash
cd backend
npm install
npm start
```

তারপর ব্রাউজারে খুলুন: http://localhost:3000

শুধু ফ্রন্টএন্ড দেখতে চাইলে `frontend/` ফোল্ডারটি যেকোনো স্ট্যাটিক সার্ভার দিয়ে চালান (তবে ফর্ম জমা দিতে ব্যাকএন্ড লাগবে; ব্যাকএন্ড ছাড়া তথ্য localStorage-এ সংরক্ষিত হয়)।

## MongoDB (Atlas) সেটআপ

ডিফল্টভাবে ব্যাকএন্ড JSON ফাইলে (`backend/data/*.json`) তথ্য সংরক্ষণ করে — কোনো সেটআপ ছাড়াই চলে। আসল ডাটাবেইজ ব্যবহার করতে:

1. **Atlas-এ ফ্রি ক্লাস্টার বানান** — [mongodb.com/atlas](https://www.mongodb.com/atlas) থেকে ফ্রি (M0) ক্লাস্টার তৈরি করুন।
2. **ডাটাবেইজ ইউজার বানান** — Atlas → Database Access → Add New Database User (পাসওয়ার্ডটি সংরক্ষণ করে রাখুন)।
3. **নেটওয়ার্ক অ্যাক্সেস দিন** — Atlas → Network Access → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) (শুধু ডেভ/শুরুর জন্য)।
4. **কানেকশন স্ট্রিং নিন** — Atlas → Database → Connect → Drivers → কানেকশন স্ট্রিংটি কপি করুন।
5. **`.env` বানান** — `backend/.env.example` কপি করে `backend/.env` বানিয়ে `MONGODB_URI`-তে আসল স্ট্রিংটি বসান (ইউজারনেম ও পাসওয়ার্ডসহ)। `.env` কখনো গিটহাবে কমিট করবেন না — এটি `.gitignore`-এ আছে।
6. **সিড তথ্য তুলুন** — সার্ভারের JSON ফাইলের ৮ জন টিউটর, ৫টি অফার ও ৩টি অনুরোধ MongoDB-তে তুলতে:

```bash
cd backend
npm install
npm run seed:mongo
```

স্ক্রিপ্টটি শুধু খালি কালেকশনেই তথ্য ঢোকায় — দুইবার চালালেও ডুপ্লিকেট হয় না।

7. **সার্ভার চালান** — `npm start`। `MONGODB_URI` না থাকলে বা MongoDB-তে সংযোগ না হলে সার্ভার নিজে থেকেই JSON ফাইলে ফিরে যায়, ক্র্যাশ করে না। কোন স্টোরেজ চলছে তা দেখতে: `GET /api/health` — `"db": "mongo"` বা `"db": "json"`।

## ব্যাকএন্ড হোস্ট করা (Render, ফ্রি)

1. Render-এ (render.com) GitHub দিয়ে লগইন করে **New → Blueprint** দিয়ে এই রেপোটি নির্বাচন করুন — রেপোর `render.yaml` থেকে ফ্রি ওয়েব সার্ভিসটি তৈরি হবে।
2. Render ড্যাশবোর্ডে সার্ভিসটির **Environment** ট্যাবে `MONGODB_URI` ভ্যারিয়েবলে Atlas-এর কানেকশন স্ট্রিংটি বসান।
3. ডেপ্লয় শেষে সার্ভিসের URL পাবেন, যেমন `https://tuition-platform.onrender.com` — সেটি `frontend/config.js` (ও `docs/config.js` — GitHub Pages-এর কপি)-এ `window.API_BASE`-এ বসিয়ে কমিট করুন, তাহলে লাইভ সাইটের ফর্মগুলো সরাসরি হোস্ট করা ব্যাকএন্ডে তথ্য পাঠাবে।

## API এন্ডপয়েন্ট

| মেথড | পাথ | বিবরণ |
|------|-----|-------|
| GET | `/api/health` | সার্ভারের অবস্থা (`db`: `mongo` বা `json` — কোন স্টোরেজ চলছে) |
| GET | `/api/tutors` | সব টিউটর (ফিল্টার: `?subject=গণিত&class=HSC&area=ধানমন্ডি&maxFee=6000&q=বুয়েট`) |
| GET | `/api/tutors/:id` | একজন টিউটরের প্রোফাইল |
| POST | `/api/tutors` | নতুন টিউটর নিবন্ধন |
| PATCH | `/api/tutors/:id` | টিউটরের তথ্য বদলানো (যেমন `{"available": false}`) |
| DELETE | `/api/tutors/:id` | টিউটর মুছে ফেলা |
| GET | `/api/requests` | সব টিউটরের অনুরোধ |
| GET | `/api/requests/:id` | একটি অনুরোধের বিস্তারিত |
| POST | `/api/requests` | নতুন টিউটরের অনুরোধ |
| PATCH | `/api/requests/:id` | অনুরোধের স্ট্যাটাস বদলানো (`নতুন` / `যোগাযোগ হয়েছে` / `সম্পন্ন`) |
| DELETE | `/api/requests/:id` | অনুরোধ মুছে ফেলা |
| GET | `/api/offers` | সব টিউশন অফার (ফিল্টার: `?subject=পদার্থবিজ্ঞান&class=SSC%2027&location=ময়মনসিংহ&minSalary=3000&gender=male&q=Stadium`) |
| GET | `/api/offers/:id` | একটি অফারের বিস্তারিত |
| POST | `/api/offers` | নতুন টিউশনির অফার পোস্ট করা — শুধু অ্যাডমিন প্যানেলের ফর্ম থেকে ব্যবহৃত হয় |
| PATCH | `/api/offers/:id` | অফারের স্ট্যাটাস বদলানো (`খোলা` / `বন্ধ`) |
| DELETE | `/api/offers/:id` | অফার মুছে ফেলা |

## অ্যাডমিন প্যানেল

`admin.html` খুলে পাসকোড দিয়ে ঢুকুন। ডিফল্ট পাসকোড: **`admin123`** — প্যানেলের সেটিংস ট্যাব থেকে বদলে নিন। লগইন অবস্থা ট্যাবের সেশনে মনে থাকে (রিফ্রেশ করলে আবার চাইবে না, ট্যাব বন্ধ করলে আবার চাইবে)।

প্যানেলে আছে: পরিসংখ্যান ড্যাশবোর্ড, টিউটর/অফার/অনুরোধের তালিকা ও ব্যবস্থাপনা (দেখা, স্ট্যাটাস বদলানো, মুছে ফেলা) এবং অফারসমূহ ট্যাবে নতুন অফার যোগ করার ফর্ম। সতর্কতা: এটি একটি সহজ ক্লায়েন্ট-সাইড পাসকোড গেট, ব্যাংক-মানের নিরাপত্তা নয়। লাইভ স্ট্যাটিক সাইটে (GitHub Pages) পরিবর্তন শুধু ব্রাউজারে সংরক্ষিত হয়; ব্যাকএন্ড চালু থাকলে পরিবর্তন সার্ভারে সংরক্ষিত হয়।

## Features (English)

- Tutor directory with live search & filters (subject, class, area, max fee)
- Tutor profile modal with education, experience, fee and reviews
- Student/parent request form and tutor registration form
- Tuition offers: tuition jobs posted by the admin only (Admin panel → অফারসমূহ → অফার যোগ করুন) — teacher gender preference, preferred department, location, class, subjects, student count, salary, weekly schedule, media fee — with live filters and a detail view with application instructions; the old public post-offer page is now just a notice pointing visitors to the admin panel
- Admin panel (`admin.html`): passcode login (default `admin123`, changeable in Settings), stats dashboard, add offers, manage tutors (available/busy toggle, delete), offers (open/close, delete) and requests (status, delete)
- Bengali-first, mobile-friendly UI; works with localStorage fallback when the API is down
- Node.js + Express backend with MongoDB (Mongoose) when `MONGODB_URI` is set, and JSON-file storage as a fallback when it is not; seed with `npm run seed:mongo`

## লাইসেন্স

MIT
