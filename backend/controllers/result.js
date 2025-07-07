const Student = require("../models/students");
       
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
    const { enroll_no } = req.query;

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
   
// DELETE 
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
