const express = require("express");
const router = express.Router();

const {
  createStudent,
  getAllStudents,
  getStudentsByBranch, 
  getStudentByEnrollNo,
  searchStudentsByName, 
  updateStudentByEnrollNo,
  deleteStudentByEnrollNo,
  addSemesterData, 
  getStudentStats,
} = require("../controllers/result");

const { Query, getAllQueries } = require("../controllers/queries");
const { sendEmail } = require("../controllers/email");

// Student routes
router.post("/students", createStudent);
router.get("/students", getAllStudents);
router.get("/students/stats", getStudentStats); 
router.get("/students/search/name", searchStudentsByName); 
router.get("/students/branch", getStudentsByBranch);
router.get("/students/enroll_no", getStudentByEnrollNo);
router.put("/students/:enroll_no", updateStudentByEnrollNo);
router.delete("/students/:enroll_no", deleteStudentByEnrollNo);
router.post("/students/:enroll_no/semesters", addSemesterData); 

router.post("/Query", Query);
router.get("/getAllQueries", getAllQueries);

router.post("/email/send-result", sendEmail);


module.exports = router;
