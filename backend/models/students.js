const mongoose = require("mongoose");

// Subject Schema for individual subjects
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
  is_back: {
    type: Boolean,
    default: false,
  },
  last_updated: {
    type: Date,
    default: Date.now,
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
    has_backs: {
      type: Boolean,
      default: false,
    },
    failed_subjects: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: [
        "Active",
        "Back (1 subject)",
        "Back (2 subjects)",
        "Back (3+ subjects)",
        "Completed",
        "Dropped",
      ],
      default: "Active",
    },
    total_marks: {
      type: Number,
      default: 0,
    },
    max_marks: {
      type: Number,
      default: 0,
    },
    total_credits: {
      type: Number,
      default: 0,
    },
    max_credits: {
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
    cgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    division: {
      type: String,
      enum: [
        "Exemplary Performance",
        "First Division",
        "Second Division",
        "Third Division",
        "Fail",
      ],
      default: "Fail",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_updated",
    },
  }
);

studentSchema.index({ enroll_no: 1 });
studentSchema.index({ sid: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ branch_code: 1 });
studentSchema.index({ admission_year: 1 });

studentSchema.pre("save", function (next) {
  this.calculateOverallPerformance();
  this.updateBackStatus();
  next();
});

// IP University Grade Point Mapping
const getGradePoint = (marks) => {
  const numMarks = parseInt(marks);
  if (numMarks >= 90) return 10; // O
  if (numMarks >= 75) return 9; // A+
  if (numMarks >= 65) return 8; // A
  if (numMarks >= 55) return 7; // B+
  if (numMarks >= 50) return 6; // B
  if (numMarks >= 45) return 5; // C
  if (numMarks >= 40) return 4; // P
  return 0; 
};

const getLetterGrade = (marks) => {
  const numMarks = parseInt(marks);
  if (numMarks >= 90) return "O";
  if (numMarks >= 75) return "A+";
  if (numMarks >= 65) return "A";
  if (numMarks >= 55) return "B+";
  if (numMarks >= 50) return "B";
  if (numMarks >= 45) return "C";
  if (numMarks >= 40) return "P";
  return "F";
};

const getDivision = (cgpa) => {
  if (cgpa === 10) return "Exemplary Performance";
  if (cgpa >= 6.5) return "First Division";
  if (cgpa >= 5.0) return "Second Division";
  if (cgpa >= 4.0) return "Third Division";
  return "Fail";
};

studentSchema.methods.calculateSGPA = function (semesterIndex) {
  const semester = this.semesters[semesterIndex];
  if (!semester || !semester.subjects.length) return 0;

  let totalCreditPoints = 0;
  let totalCredits = 0;
  let totalMarks = 0;
  let maxMarks = 0;

  semester.subjects.forEach((subject) => {
    const marks = parseInt(subject.marks) || 0;
    const credits = subject.credits || 0;
    const gradePoint = getGradePoint(marks);

    // Update subject grade based on marks
    subject.grade = getLetterGrade(marks);
    subject.is_back = marks < 40;

    totalCreditPoints += credits * gradePoint;
    totalCredits += credits;
    totalMarks += marks;
    maxMarks += 100; 
  });

  semester.total_credits = totalCredits;
  semester.max_credits = totalCredits;
  semester.total_marks = totalMarks;
  semester.max_marks = maxMarks;
  semester.total_credit_marks = totalCreditPoints;
  semester.max_credit_marks = totalCredits * 10; 
  semester.subject_count = semester.subjects.length;

  const sgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
  semester.sgpa = Math.round(sgpa * 100) / 100; 
  semester.percentage =
    maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100 * 100) / 100 : 0;
  semester.credit_percentage =
    semester.max_credit_marks > 0
      ? Math.round(
          (totalCreditPoints / semester.max_credit_marks) * 100 * 100
        ) / 100
      : 0;

  return semester.sgpa;
};

studentSchema.methods.calculateOverallPerformance = function () {
  let totalMarks = 0;
  let maxMarks = 0;
  let totalCredits = 0;
  let maxCredits = 0;
  let totalCreditPoints = 0;
  let maxCreditMarks = 0;

  this.semesters.forEach((semester, index) => {
    this.calculateSGPA(index);

    totalMarks += semester.total_marks || 0;
    maxMarks += semester.max_marks || 0;
    totalCredits += semester.total_credits || 0;
    maxCredits += semester.max_credits || 0;
    totalCreditPoints += semester.total_credit_marks || 0;
    maxCreditMarks += semester.max_credit_marks || 0;
  });

  this.total_marks = totalMarks;
  this.max_marks = maxMarks;
  this.total_credits = totalCredits;
  this.max_credits = maxCredits;
  this.total_credit_marks = totalCreditPoints;
  this.max_credit_marks = maxCreditMarks;

  const cgpa = totalCredits > 0 ? totalCreditPoints / totalCredits : 0;
  this.cgpa = Math.round(cgpa * 100) / 100; 
  this.percentage =
    maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100 * 100) / 100 : 0;
  this.credit_percentage = Math.round(this.cgpa * 10 * 100) / 100;

  this.division = getDivision(this.cgpa);
};

studentSchema.methods.updateBackStatus = function () {
  const failedSubjects = [];

  this.semesters.forEach((semester) => {
    semester.subjects.forEach((subject) => {
      if (subject.is_back || subject.grade === "F") {
        failedSubjects.push(subject.subject_code);
      }
    });
  });

  this.failed_subjects = [...new Set(failedSubjects)];
  this.has_backs = failedSubjects.length > 0;

  if (failedSubjects.length === 0) {
    this.status = "Active";
  } else if (failedSubjects.length === 1) {
    this.status = "Back (1 subject)";
  } else if (failedSubjects.length === 2) {
    this.status = "Back (2 subjects)";
  } else {
    this.status = "Back (3+ subjects)";
  }
};

studentSchema.statics.recalculateAllCGPA = async function () {
  const students = await this.find({});
  const bulkOps = [];

  students.forEach((student) => {
    student.calculateOverallPerformance();
    bulkOps.push({
      updateOne: {
        filter: { _id: student._id },
        update: {
          $set: {
            cgpa: student.cgpa,
            division: student.division,
            percentage: student.percentage,
            credit_percentage: student.credit_percentage,
            total_credit_marks: student.total_credit_marks,
            semesters: student.semesters,
          },
        },
      },
    });
  });

  if (bulkOps.length > 0) {
    await this.bulkWrite(bulkOps);
  }

  return bulkOps.length;
};
studentSchema.statics.findByEnrollNo = function (enrollNo) {
  return this.findOne({ enroll_no: enrollNo });
};

studentSchema.statics.findBySID = function (sid) {
  return this.findOne({ sid: sid });
};

studentSchema.statics.findByBranch = function (branchCode) {
  return this.find({ branch_code: branchCode });
};

module.exports = mongoose.model("Student", studentSchema);
