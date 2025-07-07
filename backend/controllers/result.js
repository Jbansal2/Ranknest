const Student = require("../models/students");

// POST - Create a new student
exports.createStudent = async (req, res) => {
  try {
    console.log(
      "Creating student with data:",
      JSON.stringify(req.body, null, 2)
    );

    const { enroll_no, name, course_code, admission_year, semesters } =
      req.body;
    if (!enroll_no || !name || !course_code || !admission_year) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: enroll_no, name, course_code, admission_year",
      });
    }
    const existingStudent = await Student.findOne({ enroll_no });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this enrollment number already exists",
      });
    }
    const studentData = {
      enroll_no,
      name,
      course_code,
      admission_year,
      semesters: semesters || [],
    };

    const newStudent = new Student(studentData);
    const savedStudent = await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: savedStudent,
    });
  } catch (err) {
    console.error("Error creating student:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: err.message,
    });
  }
};

// GET - Retrieve all students with filtering
exports.getAllStudents = async (req, res) => {
  try {
    const {
      course_code,
      admission_year,
      semester_no,
      page = 1,
      limit = 50,
    } = req.query;

    // Build query
    const query = {};
    if (course_code) query.course_code = course_code;
    if (admission_year) query.admission_year = Number(admission_year);

    console.log("Query Params:", { course_code, admission_year, semester_no });

    let students;

    if (semester_no && semester_no !== "OVERALL") {
      const semesterNo = Number(semester_no);
      if (isNaN(semesterNo) || semesterNo < 1 || semesterNo > 8) {
        return res.status(400).json({
          success: false,
          message: "Invalid semester number. Must be between 1-8 or 'OVERALL'",
        });
      }
      query.semesters = { $elemMatch: { semester_no: semesterNo } };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const totalCount = await Student.countDocuments(query);

    students = await Student.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ enroll_no: 1 })
      .lean();

    console.log("MongoDB Query:", query);
    console.log("Students Found:", students.length);

    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found.",
        data: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / Number(limit)),
        },
      });
    }
    const responseData = students.map((student) => ({
      enroll_no: student.enroll_no,
      name: student.name,
      course_code: student.course_code,
      admission_year: student.admission_year,
      semesters:
        semester_no === "OVERALL"
          ? student.semesters || []
          : semester_no
          ? (student.semesters || []).filter(
              (sem) => sem.semester_no === Number(semester_no)
            )
          : student.semesters || [],
    }));

    res.status(200).json({
      success: true,
      message: "Students retrieved successfully.",
      data: responseData,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (err) {
    console.error("Error retrieving students:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve students",
      error: err.message,
    });
  }
};

exports.getStudentsByBranch = async (req, res) => {
  try {
    const { course_code, admission_year, semester_no } = req.query;

    if (!course_code) {
      return res.status(400).json({
        success: false,
        message: "Course code is required",
      });
    }

    const query = { course_code };

    // Optional filters
    if (admission_year) query.admission_year = admission_year;
    if (semester_no && semester_no !== "OVERALL") {
      query["semesters.semester_no"] = parseInt(semester_no);
    }

    const students = await Student.find(query).sort({ enroll_no: 1 }).lean();

    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found for the given filters.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: `Students from course ${course_code} retrieved successfully.`,
      data: students,
      count: students.length,
    });
  } catch (err) {
    console.error("Error retrieving students by branch:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve students",
      error: err.message,
    });
  }
};

exports.getStudentByEnrollNo = async (req, res) => {
  try {
    const { enroll_no } = req.query; // ← FIXED HERE

    if (!enroll_no) {
      return res.status(400).json({
        success: false,
        message: "Enrollment number is required",
      });
    }

    const student = await Student.findOne({ enroll_no }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (err) {
    console.error("Error retrieving student:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve student",
      error: err.message,
    });
  }
};

// GET - Search students by name
exports.searchStudentsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name query must be at least 2 characters long",
      });
    }

    const students = await Student.find({
      name: { $regex: new RegExp(name.trim(), "i") },
    })
      .sort({ name: 1 })
      .limit(20)
      .lean();

    if (!students || students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found with that name.",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Students found successfully",
      data: students,
      count: students.length,
    });
  } catch (err) {
    console.error("Error searching students by name:", err);
    res.status(500).json({
      success: false,
      message: "Failed to search students",
      error: err.message,
    });
  }
};

// PUT - Update student by enrollment number
exports.updateStudentByEnrollNo = async (req, res) => {
  try {
    const { enroll_no } = req.params;
    const updateData = { ...req.body };

    console.log(
      "Updating student:",
      enroll_no,
      "with data:",
      JSON.stringify(updateData, null, 2)
    );

    if (!enroll_no) {
      return res.status(400).json({
        success: false,
        message: "Enrollment number is required",
      });
    }

    if (updateData.enroll_no && updateData.enroll_no !== enroll_no) {
      return res.status(400).json({
        success: false,
        message: "Cannot change enrollment number",
      });
    }
    delete updateData.enroll_no;

    const updatedStudent = await Student.findOneAndUpdate(
      { enroll_no },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    ).lean();

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (err) {
    console.error("Error updating student:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(400).json({
      success: false,
      message: "Failed to update student",
      error: err.message,
    });
  }
};

// DELETE - Delete student by enrollment number
exports.deleteStudentByEnrollNo = async (req, res) => {
  try {
    const { enroll_no } = req.params;

    if (!enroll_no) {
      return res.status(400).json({
        success: false,
        message: "Enrollment number is required",
      });
    }

    const deletedStudent = await Student.findOneAndDelete({ enroll_no }).lean();

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent,
    });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: err.message,
    });
  }
};

// POST - Add semester data to student
exports.addSemesterData = async (req, res) => {
  try {
    const { enroll_no } = req.params;
    const semesterData = req.body;

    if (!semesterData.semester_no) {
      return res.status(400).json({
        success: false,
        message: "Semester number is required",
      });
    }

    const student = await Student.findOne({ enroll_no });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const existingSemester = student.semesters.find(
      (sem) => sem.semester_no === semesterData.semester_no
    );

    if (existingSemester) {
      return res.status(409).json({
        success: false,
        message: "Semester data already exists for this student",
      });
    }

    student.semesters.push(semesterData);
    const updatedStudent = await student.save();

    res.status(201).json({
      success: true,
      message: "Semester data added successfully",
      data: updatedStudent,
    });
  } catch (err) {
    console.error("Error adding semester data:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add semester data",
      error: err.message,
    });
  }
};

exports.getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const courseStats = await Student.aggregate([
      {
        $group: {
          _id: "$course_code",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const yearStats = await Student.aggregate([
      {
        $group: {
          _id: "$admission_year",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Average SGPA overall
    const sgpaStats = await Student.aggregate([
      { $unwind: "$semesters" },
      {
        $match: {
          "semesters.sgpa": { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalSGPA: { $sum: "$semesters.sgpa" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          average_sgpa: { $round: [{ $divide: ["$totalSGPA", "$count"] }, 2] },
        },
      },
    ]);
    const averageSGPA = sgpaStats[0]?.average_sgpa || null;

    // Average SGPA by course_code
    const sgpaByCourse = await Student.aggregate([
      { $unwind: "$semesters" },
      {
        $match: {
          "semesters.sgpa": { $ne: null },
        },
      },
      {
        $group: {
          _id: "$course_code",
          totalSGPA: { $sum: "$semesters.sgpa" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          course_code: "$_id",
          average_sgpa: { $round: [{ $divide: ["$totalSGPA", "$count"] }, 2] },
        },
      },
    ]);

    const courseMapping = {
      "027": "CSE",
      116: "AIML",
      119: "AIDS",
      127: "CST",
    };

    const formattedCourseStats = courseStats.map((stat) => ({
      course_code: stat._id,
      course_name: courseMapping[stat._id] || "Unknown",
      count: stat.count,
    }));

    const formattedSgpaByCourse = sgpaByCourse.map((item) => ({
      course_code: item.course_code,
      course_name: courseMapping[item.course_code] || "Unknown",
      average_sgpa: item.average_sgpa,
    }));

    res.status(200).json({
      success: true,
      message: "Student statistics retrieved successfully",
      data: {
        total_students: totalStudents,
        average_sgpa: averageSGPA,
        by_course: formattedCourseStats,
        average_sgpa_by_course: formattedSgpaByCourse,
        by_admission_year: yearStats,
      },
    });
  } catch (err) {
    console.error("Error retrieving student statistics:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve statistics",
      error: err.message,
    });
  }
};
