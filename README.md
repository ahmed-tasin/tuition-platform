# tuition-platform

Tuition platform — বাংলাদেশের অভিভাবক ও শিক্ষার্থীদের সাথে যাচাইকৃত টিউটরদের সংযোগের একটি সম্পূর্ণ টিউশন মিডিয়া প্লাটফর্ম।

## বৈশিষ্ট্য

- **হোম পেজ** — হিরো, বিষয়/শ্রেণি/এলাকা/বাজেট দিয়ে খোঁজা, সেরা টিউটর
- **টিউটর তালিকা** — লাইভ সার্চ ও ফিল্টার (বিষয়, শ্রেণি, এলাকা, সর্বোচ্চ ফি), রেটিং ও মাসিক ফিসহ কার্ড
- **টিউটর প্রোফাইল** — শিক্ষাগত যোগ্যতা, অভিজ্ঞতা, ফি, ফোন নম্বর ও শিক্ষার্থীদের রিভিউ (মডাল ভিউ)
- **টিউটর চাই** — শিক্ষার্থী/অভিভাবকের অনুরোধ ফর্ম (শ্রেণি, বিষয়, এলাকা, বাজেট, পছন্দের সময়)
- **টিউটর নিবন্ধন** — নতুন টিউটরের রেজিস্ট্রেশন ফর্ম, জমা দিলে প্রোফাইল তালিকায় যুক্ত হয়
- **বাংলা-প্রথম UI** — পুরো ইন্টারফেস বাংলায়, মোবাইল-বান্ধব ডিজাইন
- **অফলাইন ফলব্যাক** — ব্যাকএন্ড না চললে ফ্রন্টএন্ড localStorage ব্যবহার করে কাজ চালিয়ে যায়

## ফোল্ডার কাঠামো

```
tuition-platform/
├── README.md
├── frontend/                 # স্ট্যাটিক ফ্রন্টএন্ড (কোনো build ধাপ লাগে না)
│   ├── index.html            # হোম পেজ
│   ├── tutors.html           # টিউটর তালিকা ও ফিল্টার
│   ├── request.html          # টিউটরের অনুরোধ ফর্ম
│   ├── register.html         # টিউটর নিবন্ধন ফর্ম
│   ├── app.js                # API কল, ফিল্টার, প্রোফাইল মডাল, ফলব্যাক লজিক
│   └── styles.css            # ডিজাইন
└── backend/                  # Node.js + Express API (কোনো ডেটাবেস নেই)
    ├── server.js             # REST API + ফ্রন্টএন্ড সার্ভ
    ├── package.json
    ├── .gitignore
    └── data/
        ├── tutors.json       # ৮ জন সিড টিউটর
        └── requests.json     # শিক্ষার্থীদের অনুরোধ (শুরুতে খালি)
```

## স্থানীয়ভাবে চালানো

```bash
cd backend
npm install
npm start
```

তারপর ব্রাউজারে খুলুন: http://localhost:3000

শুধু ফ্রন্টএন্ড দেখতে চাইলে `frontend/` ফোল্ডারটি যেকোনো স্ট্যাটিক সার্ভার দিয়ে চালান (তবে ফর্ম জমা দিতে ব্যাকএন্ড লাগবে; ব্যাকএন্ড ছাড়া তথ্য localStorage-এ সংরক্ষিত হয়)।

## API এন্ডপয়েন্ট

| মেথড | পাথ | বিবরণ |
|------|-----|-------|
| GET | `/api/health` | সার্ভারের অবস্থা |
| GET | `/api/tutors` | সব টিউটর (ফিল্টার: `?subject=গণিত&class=HSC&area=ধানমন্ডি&maxFee=6000&q=বুয়েট`) |
| GET | `/api/tutors/:id` | একজন টিউটরের প্রোফাইল |
| POST | `/api/tutors` | নতুন টিউটর নিবন্ধন |
| GET | `/api/requests` | সব টিউটরের অনুরোধ |
| POST | `/api/requests` | নতুন টিউটরের অনুরোধ |

## Features (English)

- Tutor directory with live search & filters (subject, class, area, max fee)
- Tutor profile modal with education, experience, fee and reviews
- Student/parent request form and tutor registration form
- Bengali-first, mobile-friendly UI; works with localStorage fallback when the API is down
- Node.js + Express backend with JSON-file storage (no database)

## লাইসেন্স

MIT
