const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudentsByBranch, 
  deleteStudentByEnrollNo,

} = require("../controllers/result");

const { Query, getAllQueries } = require("../controllers/queries");
const { sendEmail } = require("../controllers/email");

// Student routes

router.get("/students/branch", getStudentsByBranch);
router.get("/students/enroll_no", getStudentByEnrollNo);
router.delete("/students/:enroll_no", deleteStudentByEnrollNo);
 

router.post("/Query", Query);
router.get("/getAllQueries", getAllQueries);


module.exports = router;
