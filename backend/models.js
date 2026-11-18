// Mongoose schemas mirroring the JSON-file data exactly.
// Field names match data/*.json so API responses stay identical.
const mongoose = require("mongoose");

const clean = {
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    class: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    text: { type: String, default: "" }
  },
  { _id: false }
);

const tutorSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    university: { type: String, required: true },
    department: { type: String, default: "" },
    subjects: { type: [String], default: [] },
    classes: { type: [String], default: [] },
    areas: { type: [String], default: [] },
    monthlyFee: { type: Number, required: true },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    phone: { type: String, required: true },
    about: { type: String, default: "" },
    available: { type: Boolean, default: true },
    reviews: { type: [reviewSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
  },
  clean
);

const offerSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    teacherGender: { type: String, enum: ["male", "female", "any"], default: "any" },
    preferredDepartment: { type: String, default: "" },
    location: { type: String, required: true },
    class: { type: String, required: true },
    subjects: { type: [String], default: [] },
    studentCount: { type: Number, default: 1 },
    salary: { type: Number, required: true },
    daysPerWeek: { type: Number, default: 3 },
    durationPerDay: { type: String, default: "১ ঘণ্টা" },
    mediaFee: { type: String, default: "প্রযোজ্য" },
    posterName: { type: String, default: "" },
    phone: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["খোলা", "বন্ধ"], default: "খোলা" },
    createdAt: { type: Date, default: Date.now }
  },
  clean
);

const requestSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    studentName: { type: String, required: true },
    guardianName: { type: String, default: "" },
    phone: { type: String, required: true },
    class: { type: String, required: true },
    subjects: { type: [String], default: [] },
    area: { type: String, required: true },
    budget: { type: Number, default: null },
    preferredTime: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["নতুন", "যোগাযোগ হয়েছে", "সম্পন্ন"], default: "নতুন" },
    createdAt: { type: Date, default: Date.now }
  },
  clean
);

const Tutor = mongoose.model("Tutor", tutorSchema);
const Offer = mongoose.model("Offer", offerSchema);
const Request = mongoose.model("Request", requestSchema);

// Strip Mongo internals from a lean() document so API output matches the JSON shape.
function cleanDoc(doc) {
  if (!doc) return doc;
  const copy = { ...doc };
  delete copy._id;
  delete copy.__v;
  return copy;
}

module.exports = { Tutor, Offer, Request, cleanDoc };
