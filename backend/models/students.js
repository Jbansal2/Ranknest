const mongoose = require("mongoose");

// Subject Schema 
const subjectSchema = new mongoose.Schema({
  subject_code: {
    type: String,
    required: true,
    trim: true,
  },
  subject_name: {
    type: String,
    required: true,
    trim: true,
  },
  credits: {
    type: Number,
    required: true,
    min: 0,
  },
  minor: {
    type: String,
    default: "0",
  },
  major: {
    type: String,
    default: "0",
  },
  marks: {
    type: String,
    default: "0",
  },
  grade: {
    type: String,
    enum: ["O", "A+", "A", "B+", "B", "C", "P", "F", "I", "Ab"],
    default: "F",
  },
});

// Semester Schema
const semesterSchema = new mongoose.Schema({
  semester_no: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  subjects: [subjectSchema],
  subject_count: {
    type: Number,
    default: 0,
  },
  total_marks: {
    type: Number,
    default: 0,
  },
  max_marks: {
    type: Number,
    default: 0,
  },
  max_credits: {
    type: Number,
    default: 0,
  },
  total_credits: {
    type: Number,
    default: 0,
  },
  total_credit_marks: {
    type: Number,
    default: 0,
  },
  max_credit_marks: {
    type: Number,
    default: 0,
  },
  sgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  credit_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

// Main Student Schema
const studentSchema = new mongoose.Schema(
  {
    enroll_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[0-9]{11}$/,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    sid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[0-9]{12}$/,
    },
    scheme_id: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{12}$/,
    },
    insti_code: {
      type: String,
      required: true,
      trim: true,
    },
    course_code: {
      type: String,
      required: true,
      trim: true,
    },
    branch_code: {
      type: String,
      required: true,
      trim: true,
    },
    branch_name: {
      type: String,
      required: true,
      trim: true,
    },
    admission_year: {
      type: String,
      required: true,
      match: /^[0-9]{4}$/,
    },
    semesters: [semesterSchema],
    
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_updated",
    },
  }
);

