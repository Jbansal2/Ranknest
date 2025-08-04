import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useParams } from "react-router-dom";
import LoginForm from "../Components/studentDashboard/StudentLogin";
import StudentInfo from "../Components/studentDashboard/StudentInfo";
import Tabs from "../Components/studentDashboard/Tabs";
import SummaryCards from "../Components/studentDashboard/SummaryCards";
import ChartSection from "../Components/studentDashboard/ChartSection";
import ResultTable from "../Components/studentDashboard/ResultTable";
import SubjectTable from "../Components/studentDashboard/SubjectTable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Components/Footer";

const StudentProfile = () => {
  const { enrollmentNo } = useParams();
  const [inputEnrollmentNo, setInputEnrollmentNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [showForm, setShowForm] = useState(!enrollmentNo);
  const [activeTab, setActiveTab] = useState("OVERALL");

  const [visibleColumnsAbsolute, setVisibleColumnsAbsolute] = useState({
    Sem: true,
    Marks: true,
    Percentage: true,
    "C. Marks": false,
    "C. Percentage": false,
    SGPA: true,
  });

  const [visibleColumnsCumulative, setVisibleColumnsCumulative] = useState({
    Sem: true,
    Marks: true,
    Percentage: true,
    "C. Marks": false,
    "C. Percentage": false,
    CGPA: true,
  });

  const [showAbsoluteDropdown, setShowAbsoluteDropdown] = useState(false);
  const [showCumulativeDropdown, setShowCumulativeDropdown] = useState(false);

  const absoluteDropdownRef = useRef(null);
  const cumulativeDropdownRef = useRef(null);

  // Decrypt API response
  const decryptData = (encryptedResponse) => {
    try {
      const { iv, encryptedData } = encryptedResponse;
      if (!iv || !encryptedData) {
        throw new Error("Invalid encrypted response format");
      }
      const key = CryptoJS.enc.Hex.parse(import.meta.env.VITE_ENCRYPTION_KEY);
      const ivParsed = CryptoJS.enc.Hex.parse(iv);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(encryptedData) },
        key,
        { iv: ivParsed }
      );
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) {
        throw new Error("Decrypted data is empty or invalid");
      }
      return JSON.parse(decryptedString);
    } catch (err) {
      console.error("Decryption Error:", err);
      throw new Error("Failed to decrypt response data");
    }
  };

  const toggleColumnAbsolute = (column) => {
    setVisibleColumnsAbsolute((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const toggleColumnCumulative = (column) => {
    setVisibleColumnsCumulative((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (absoluteDropdownRef.current && !absoluteDropdownRef.current.contains(event.target)) {
        setShowAbsoluteDropdown(false);
      }
      if (cumulativeDropdownRef.current && !cumulativeDropdownRef.current.contains(event.target)) {
        setShowCumulativeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchStudentData = async (enrollNo) => {
    if (!/^\d+$/.test(enrollNo)) {
      toast.error("Invalid enrollment number.");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/api/auth/students/${enrollNo}`, {
        headers: {
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
      });
      const { success, data, message } = response.data;
      if (!success) {
        throw new Error(message || "Failed to fetch student data");
      }

      const decryptedResponse = decryptData(data);
      const studentData = decryptedResponse.data; 
      if (studentData && studentData.enroll_no && Array.isArray(studentData.semesters)) {
        setStudentData(studentData);
        setShowForm(false);
        toast.success("Student profile fetched successfully!");
        window.history.pushState({}, "", `/studentprofile/${enrollNo}`);
      } else {
        throw new Error("Invalid decrypted student data format");
      }
    } catch (error) {
      console.error("Error fetching student data:", {
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
      let errorMessage = "Failed to fetch student profile.";
      if (error.message.includes("decrypt")) {
        errorMessage = "Error decrypting student data. Please check the encryption key.";
      } else if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Student not found with this enrollment number.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error.";
      }
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enrollmentNo) {
      fetchStudentData(enrollmentNo);
    }
  }, [enrollmentNo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchStudentData(inputEnrollmentNo);
  };

  const handleClose = () => {
    if (showForm) {
      setInputEnrollmentNo("");
    } else {
      setShowForm(true);
      setStudentData(null);
      setInputEnrollmentNo("");
      setActiveTab("OVERALL");
      window.history.pushState({}, "", "/studentprofile");
    }
  };

  const calculateCumulativeAverages = (semesters) => {
    if (!Array.isArray(semesters) || semesters.length === 0) {
      return {
        total_marks: "N/A",
        max_marks: "N/A",
        percentage: "N/A",
        total_credit_marks: "N/A",
        max_credit_marks: "N/A",
        credit_percentage: "N/A",
        total_credits: "N/A",
        max_credits: "N/A",
        sgpa: "N/A",
      };
    }

    const validSemesters = semesters.filter((sem) => sem && sem.semester_no);
    if (validSemesters.length === 0) {
      return {
        total_marks: "N/A",
        max_marks: "N/A",
        percentage: "N/A",
        total_credit_marks: "N/A",
        max_credit_marks: "N/A",
        credit_percentage: "N/A",
        total_credits: "N/A",
        max_credits: "N/A",
        sgpa: "N/A",
      };
    }

    const total = validSemesters.reduce(
      (acc, sem) => ({
        total_marks: acc.total_marks + (parseFloat(sem.total_marks) || 0),
        max_marks: acc.max_marks + (parseFloat(sem.max_marks) || 0),
        percentage: acc.percentage + (parseFloat(sem.percentage) || 0),
        total_credit_marks: acc.total_credit_marks + (parseFloat(sem.total_credit_marks) || 0),
        max_credit_marks: acc.max_credit_marks + (parseFloat(sem.max_credit_marks) || 0),
        credit_percentage: acc.credit_percentage + (parseFloat(sem.credit_percentage) || 0),
        total_credits: acc.total_credits + (parseFloat(sem.total_credits) || 0),
        max_credits: acc.max_credits + (parseFloat(sem.max_credits) || 0),
        sgpa: acc.sgpa + (parseFloat(sem.sgpa) || 0),
        count: acc.count + 1,
      }),
      {
        total_marks: 0,
        max_marks: 0,
        percentage: 0,
        total_credit_marks: 0,
        max_credit_marks: 0,
        credit_percentage: 0,
        total_credits: 0,
        max_credits: 0,
        sgpa: 0,
        count: 0,
      }
    );

    return {
      total_marks: total.max_marks > 0 ? total.total_marks : "N/A",
      max_marks: total.max_marks > 0 ? total.max_marks : "N/A",
      percentage: total.count > 0 ? (total.percentage / total.count).toFixed(3) : "N/A",
      total_credit_marks: total.max_credit_marks > 0 ? total.total_credit_marks : "N/A",
      max_credit_marks: total.max_credit_marks > 0 ? total.max_credit_marks : "N/A",
      credit_percentage: total.count > 0 ? (total.credit_percentage / total.count).toFixed(3) : "N/A",
      total_credits: total.max_credits > 0 ? total.total_credits : "N/A",
      max_credits: total.max_credits > 0 ? total.max_credits : "N/A",
      sgpa: total.count > 0 ? (total.sgpa / total.count).toFixed(3) : "N/A",
    };
  };

  const semesters = Array.isArray(studentData?.semesters) ? studentData.semesters : [];
  const highestSemester = semesters.length > 0
    ? Math.max(...semesters.map((sem) => parseInt(sem.semester_no) || 0))
    : 0;
  const tabs = ["OVERALL"];
  for (let i = 1; i <= highestSemester; i++) {
    tabs.push(`SEM ${i}`);
  }

  let summaryData = {};
  let chartData = {};
  let subjects = [];
  let absoluteResults = [];
  let cumulativeResults = [];

  if (activeTab === "OVERALL") {
    const overallAverages = calculateCumulativeAverages(semesters);
    summaryData = {
      total_marks: overallAverages.total_marks,
      max_marks: overallAverages.max_marks,
      sgpa: overallAverages.sgpa,
      percentage: overallAverages.percentage,
      credit_marks: overallAverages.total_credit_marks,
      max_credit_marks: overallAverages.max_credit_marks,
      credit_percentage: overallAverages.credit_percentage,
      total_credits: overallAverages.total_credits,
      max_credits: overallAverages.max_credits,
    };

    const sgpaData = semesters.map((sem) => parseFloat(sem.sgpa) || 0);
    const percentageData = semesters.map((sem) => parseFloat(sem.percentage) || 0);
    const maxSgpa = Math.max(...sgpaData, 0);
    const maxSgpaIndex = sgpaData.indexOf(maxSgpa);
    const maxPercentage = Math.max(...percentageData, 0);
    const maxPercentageIndex = percentageData.indexOf(maxPercentage);

    chartData = {
      labels: semesters.map((sem) => `Sem ${sem.semester_no || 0}`),
      datasets: [
        {
          label: "SGPA",
          data: sgpaData,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Percentage",
          data: percentageData,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
      annotations: [
        {
          type: "label",
          xValue: maxSgpaIndex,
          yValue: maxSgpa,
          content: `Peak SGPA: ${maxSgpa.toFixed(2)}`,
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          color: "white",
          position: "top",
        },
        {
          type: "label",
          xValue: maxPercentageIndex,
          yValue: maxPercentage,
          content: `Peak Percentage: ${maxPercentage.toFixed(2)}%`,
          backgroundColor: "rgba(54, 162, 235, 0.8)",
          color: "white",
          position: "top",
        },
      ],
    };

    absoluteResults = semesters.map((sem) => ({
      semester: `${sem.semester_no || "N/A"}`,
      marks: sem.total_marks !== undefined && sem.max_marks !== undefined
        ? `${sem.total_marks}/${sem.max_marks}`
        : "N/A",
      percentage: sem.percentage !== undefined ? parseFloat(sem.percentage).toFixed(3) : "N/A",
      credit_marks: sem.total_credit_marks !== undefined && sem.max_credit_marks !== undefined
        ? `${sem.total_credit_marks}/${sem.max_credit_marks}`
        : "N/A",
      credit_percentage: sem.credit_percentage !== undefined
        ? parseFloat(sem.credit_percentage).toFixed(3)
        : "N/A",
      sgpa: sem.sgpa !== undefined ? parseFloat(sem.sgpa).toFixed(3) : "N/A",
    }));

    cumulativeResults = semesters.map((sem, index) => {
      const semestersUpToIndex = semesters.slice(0, index + 1);
      const averages = calculateCumulativeAverages(semestersUpToIndex);
      return {
        semester: index === 0
          ? `${sem.semester_no || "N/A"}`
          : semestersUpToIndex.map((s) => s.semester_no).join("+"),
        marks: averages.total_marks !== "N/A" && averages.max_marks !== "N/A"
          ? `${averages.total_marks}/${averages.max_marks}`
          : "N/A",
        percentage: averages.percentage !== "N/A" ? `${averages.percentage}` : "N/A",
        credit_marks: averages.total_credit_marks !== "N/A" && averages.max_credit_marks !== "N/A"
          ? `${averages.total_credit_marks}/${averages.max_credit_marks}`
          : "N/A",
        credit_percentage: averages.credit_percentage !== "N/A" ? `${averages.credit_percentage}` : "N/A",
        cgpa: averages.sgpa !== "N/A" ? averages.sgpa : "N/A",
      };
    });
  } else {
    const semesterNumber = parseInt(activeTab.split(" ")[1]);
    const semester = semesters.find((sem) => parseInt(sem.semester_no) === semesterNumber) || {};

    console.log("Selected Semester:", semester);
    console.log("Subjects:", semester.subjects);

    summaryData = {
      total_marks: semester.total_marks !== undefined ? parseFloat(semester.total_marks) : "N/A",
      max_marks: semester.max_marks !== undefined ? parseFloat(semester.max_marks) : "N/A",
      sgpa: semester.sgpa !== undefined ? parseFloat(semester.sgpa).toFixed(3) : "N/A",
      percentage: semester.percentage !== undefined ? parseFloat(semester.percentage).toFixed(3) : "N/A",
      credit_marks: semester.total_credit_marks !== undefined ? parseFloat(semester.total_credit_marks) : "N/A",
      max_credit_marks: semester.max_credit_marks !== undefined ? parseFloat(semester.max_credit_marks) : "N/A",
      credit_percentage: semester.credit_percentage !== undefined ? parseFloat(semester.credit_percentage).toFixed(3) : "N/A",
      total_credits: semester.total_credits !== undefined ? parseFloat(semester.total_credits) : "N/A",
      max_credits: semester.max_credits !== undefined ? parseFloat(semester.max_credits) : "N/A",
    };

    subjects = Array.isArray(semester.subjects) ? semester.subjects : [];
    chartData = {
      labels: subjects.length > 0 ? subjects.map((subject) => subject.paper_id || subject.subject_code || "Unknown") : ["No Data"],
      datasets: subjects.length > 0 ? [
        {
          type: "bar",
          label: "Internal",
          data: subjects.map((subject) => parseFloat(subject.minor || subject.minor_marks) || 0),
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          stack: "Stack 0",
        },
        {
          type: "bar",
          label: "External",
          data: subjects.map((subject) => parseFloat(subject.major || subject.major_marks) || 0),
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          stack: "Stack 0",
        },
        {
          type: "line",
          label: "Total",
          data: subjects.map((subject) => parseFloat(subject.marks) || 0),
          borderColor: "rgba(255, 255, 255, 1)",
          backgroundColor: "rgba(255, 255, 255, 1)",
          fill: false,
          tension: 0.4,
        },
      ] : [
        {
          type: "bar",
          label: "No Data",
          data: [0],
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        },
      ],
      subjectDetails: subjects,
    };
  }

  return (
    <div className="w-full h-full mt-25">
      <div className="w-full flex flex-col border h-full border-zinc-900 bg-black text-white p-5">
        <div className="flex-grow">
          {showForm && (
            <LoginForm
              enrollmentNo={inputEnrollmentNo}
              setEnrollmentNo={setInputEnrollmentNo}
              handleSubmit={handleSubmit}
              loading={loading}
              handleClose={handleClose}
              showForm={showForm}
            />
          )}
          {!showForm && studentData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4 w-full">
                <h1 className="text-2xl font-bold mb-1">
                  Hi, {studentData?.name || "N/A"} ({studentData?.enroll_no || "N/A"})
                </h1>
                <h1 className="text-2xl font-bold mb-1">{studentData?.admission_year || "N/A"}</h1>
              </div>
              <StudentInfo studentData={studentData} />
              <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
              <SummaryCards summaryData={summaryData} />
              <div className="space-y-6">
                <ChartSection activeTab={activeTab} chartData={chartData} />
                {activeTab === "OVERALL" ? (
                  <>
                    <ResultTable
                      title="Absolute Result Breakdown"
                      data={absoluteResults}
                      columns={visibleColumnsAbsolute}
                      visibleColumns={visibleColumnsAbsolute}
                      toggleColumn={toggleColumnAbsolute}
                      showDropdown={showAbsoluteDropdown}
                      setShowDropdown={setShowAbsoluteDropdown}
                      dropdownRef={absoluteDropdownRef}
                    />
                    <ResultTable
                      title="Cumulative Result Breakdown"
                      data={cumulativeResults}
                      columns={visibleColumnsCumulative}
                      visibleColumns={visibleColumnsCumulative}
                      toggleColumn={toggleColumnCumulative}
                      showDropdown={showCumulativeDropdown}
                      setShowDropdown={setShowCumulativeDropdown}
                      dropdownRef={cumulativeDropdownRef}
                    />
                  </>
                ) : (
                  <SubjectTable subjects={subjects} />
                )}
              </div>
            </div>
          )}
          {!showForm && !studentData && !loading && <p className="text-white">No data available.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentProfile;