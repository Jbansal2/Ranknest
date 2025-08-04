import React, { useState } from 'react';
import CryptoJS from 'crypto-js'; // Add CryptoJS import
import { User, Download, FileText, GraduationCap, Search } from 'lucide-react';
import Footer from '../Components/Footer';
import collegeMapping from '../data/collegeMapping.json'; 
import { calculateMetrics, calculateOverallMetrics } from '../utils/calculateMetrics'; 

const getCollegeName = (insti_code) => {
  if (!insti_code) return "Institution Not Specified";
  const code = String(insti_code);
  return collegeMapping[code] || `Institution Code: ${code}`;
};

const Transcript = () => {
  const [enrollNo, setEnrollNo] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showSubjects, setShowSubjects] = useState(false);
  const [loading, setLoading] = useState(false);


  const decryptData = (encryptedResponse) => {
    try {
      const { iv, encryptedData } = encryptedResponse;
      if (!iv || !encryptedData) {
        throw new Error('Invalid encrypted response format');
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
        throw new Error('Decrypted data is empty or invalid');
      }
      return JSON.parse(decryptedString);
    } catch (err) {
      console.error('Decryption Error:', err);
      throw new Error('Failed to decrypt response data');
    }
  };

  const handleSearch = async () => {
    if (!enrollNo.trim()) {
      setError('Please enter an enrollment number');
      return;
    }

    setSearchLoading(true);
    setError(null);
    setStudentData(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/students/${enrollNo}`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Student not found');
        }

        const decryptedResponse = result.data.iv && result.data.encryptedData 
          ? decryptData(result.data) 
          : result.data;
        const data = decryptedResponse.data || decryptedResponse; 

        const overallMetrics = calculateOverallMetrics(data.semesters || []);

        const collegeInfo = {
          insti_code: data.insti_code || data.institution_code,
          college_name: getCollegeName(data.insti_code || data.institution_code)
        };

        setStudentData({
          enroll_no: data.enroll_no,
          name: data.name,
          branch: data.branch_name,
          batch: data.admission_year,
          insti_code: collegeInfo.insti_code,
          college_name: collegeInfo.college_name,
          rank: data.rank || null,
          metrics: overallMetrics,
          subjects: data.semesters.flatMap((sem) =>
            (sem.subjects || []).map((sub) => ({
              paper_id: sub.subject_code,
              name: sub.subject_name,
              credits: sub.credits,
              minor: sub.minor,
              major: sub.major,
              marks: sub.marks,
              grade: sub.grade,
              is_back: sub.is_back,
              semester: `SEM-${sem.semester_no}`,
            }))
          ),
          semesters: (data.semesters || []).map((sem) => ({
            semester_no: `SEM-${sem.semester_no}`,
            sgpa: sem.sgpa,
            total_marks: sem.total_marks,
            max_marks: sem.max_marks,
            total_credits: sem.total_credits,
            max_credits: sem.max_credits,
            total_credit_marks: sem.total_credit_marks,
            max_credit_marks: sem.max_credit_marks,
            percentage: sem.percentage,
            credit_percentage: sem.credit_percentage,
          })),
          has_backs: data.has_backs,
          failed_subjects: data.failed_subjects,
        });

        console.log('Student data loaded successfully:', {
          enrollNo: data.enroll_no,
          name: data.name,
          college: collegeInfo.college_name,
          insti_code: collegeInfo.insti_code,
          semesters: data.semesters?.length || 0,
          subjects: data.semesters?.reduce((acc, sem) => acc + (sem.subjects?.length || 0), 0) || 0
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Student not found');
        setStudentData(null);
        console.error('API Error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching student data:', {
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
      setError(error.message.includes('decrypt') 
        ? 'Error decrypting student data. Please check the encryption key.'
        : 'Error fetching student data. Please try again.');
      setStudentData(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const generatePDF = async (semesterType) => {
    if (!studentData) {
      setError("Please search for a student first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        student: {
          enroll_no: studentData.enroll_no,
          name: studentData.name,
          branch: studentData.branch,
          batch: studentData.batch,
          insti_code: studentData.insti_code,
          college_name: studentData.college_name,
          rank: studentData.rank,
          selectedSemester: semesterType,
          has_backs: studentData.has_backs,
          failed_subjects: studentData.failed_subjects,
        },
      };

      if (semesterType === 'OVERALL') {
        payload.student.metrics = calculateMetrics(studentData.semesters, semesterType);
        payload.student.semesters = studentData.semesters;
        payload.student.subjects = [];
      } else if (semesterType === 'all') {
        payload.student.semesterMetrics = calculateMetrics(studentData.semesters, semesterType);
      } else {
        payload.student.metrics = calculateMetrics(studentData.semesters, semesterType);
        payload.student.subjects = (studentData.subjects || []).filter((s) => s.semester === semesterType) || [];
        payload.student.semesters = [];
      }

      console.log('PDF Payload:', {
        studentName: payload.student.name,
        collegeName: payload.student.college_name,
        instiCode: payload.student.insti_code,
        semesterType: semesterType
      });

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/generateTranscript`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY, // Add API key header
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `transcript_${studentData.name}_${semesterType.replace(/[: ]/g, "-")}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error generating PDF. Please check your data.");
      }
    } catch (error) {
      console.error("Error generating PDF:", {
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
      setError("Error generating PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSemesterSelect = (e) => {
    const value = e.target.value;
    if (value === "") return;

    setSelectedSemester(value);
    setShowSubjects(value !== 'all' && value !== 'OVERALL');
    generatePDF(value);
  };

  const handleOverallTranscript = () => {
    setSelectedSemester('OVERALL');
    setShowSubjects(false);
    generatePDF('OVERALL');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-4 sm:px-6 sm:mt-10 lg:px-8 py-6">
      <div className="w-full max-w-8xl mx-auto bg-black border-2 border-zinc-900 p-4 sm:p-6 lg:p-8 mt-6 sm:mt-10 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4">
            Generate Your Academic Transcript Instantly
          </h2>
          <div className="w-16 sm:w-24 h-0.5 bg-white mx-auto mb-4 sm:mb-6"></div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 sm:p-3 max-w-full mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full p-3 sm:p-4 bg-black text-white border-2 border-zinc-800 font-medium placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-300 pr-10 sm:pr-12 text-sm sm:text-base"
                placeholder="Search by enrollment number..."
                value={enrollNo}
                onChange={(e) => setEnrollNo(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={searchLoading}
              />
              <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
            </div>
            <button
              type="button"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-bold text-sm sm:text-lg uppercase tracking-wider border-2 border-white transition-all duration-300 transform hover:scale-105 hover:bg-black hover:text-white active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleSearch}
              disabled={searchLoading}
            >
              {searchLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm sm:text-base">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Student Card */}
      {studentData && (
        <div className="mt-6 sm:mt-8 flex mb-10">
          <div className="border-2 border-zinc-800 bg-black p-4 sm:p-6 w-full max-w-full sm:max-w-md shadow-2xl backdrop-blur-sm">
            <div className="relative z-10">
              {/* Student Header */}
              <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-black rounded-xl border-2 border-zinc-700 flex items-center justify-center">
                  <User className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base sm:text-lg lg:text-xl">
                    {studentData.name || 'Unknown'}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm">
                    {studentData.enroll_no || 'N/A'}
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm">
                    {studentData.branch} • Batch {studentData.batch}
                  </p>
                  {studentData.rank && (
                    <p className="text-green-400 text-xs sm:text-sm font-semibold">
                      Rank: {studentData.rank}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 sm:space-y-4">
                <button
                  type="button"
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-white transition-all duration-300 transform hover:scale-105 hover:bg-black hover:text-white active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={handleOverallTranscript}
                  disabled={loading && selectedSemester === 'OVERALL'}
                >
                  {loading && selectedSemester === 'OVERALL' ? (
                    <>
                      <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 sm:w-5 h-4 sm:h-5" />
                      Overall Transcript
                    </>
                  )}
                </button>

                <div className="relative">
                  <select
                    className="w-full p-2 sm:p-3 bg-black text-white border-2 border-zinc-800 font-medium focus:outline-none focus:border-white transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    value={selectedSemester === 'OVERALL' ? '' : selectedSemester}
                    onChange={handleSemesterSelect}
                    disabled={loading}
                  >
                    <option value="">Select Semester</option>
                    {studentData?.semesters?.map((sem) => (
                      <option key={sem.semester_no} value={sem.semester_no}>
                        {sem.semester_no} (SGPA: {sem.sgpa})
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-zinc-400 pointer-events-none" />
                </div>

                {loading && selectedSemester !== '' && (
                  <div className="flex items-center justify-center gap-2 text-white/80 text-xs sm:text-sm py-2">
                    <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                    Generating PDF for {selectedSemester === 'all' ? 'all semesters' : selectedSemester}...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Transcript;