import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import FilterForm from '../Components/Result/FilterForm';
import StudentTable from '../Components/Result/StudentTable';
import StudentReportModal from '../Components/Result/StudentReportModal';
import LoadingSpinner from '../Components/Result/LoadingSpinner';

const Ranklists = () => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rankingCriteria, setRankingCriteria] = useState('sgpa');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');

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
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (err) {
      console.error('Decryption Error:', err);
      throw new Error('Failed to decrypt response data');
    }
  };

  useEffect(() => {
    setStudents(null);
    setIsSubmitted(false);
    setSearchQuery('');
    setMessage('');
  }, [selectedBranch, selectedBatch, selectedSemester]);

  const handleSubmit = async ({ courseCode, admissionYear, semesterNo }) => {
    if (!courseCode || !admissionYear || !semesterNo) {
      setMessage('Please select a valid branch, batch, and semester.');
      setIsSubmitted(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setIsSubmitted(true);
    setMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const params = {
        course_code: courseCode,
        admission_year: admissionYear,
        semester_no: semesterNo === 'OVERALL' ? 'OVERALL' : semesterNo,
      };


      const response = await axios.get(`${apiUrl}/api/auth/students`, {
        params,
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY,
        },
      });


      const { success, message: responseMessage, data } = response.data;
      if (!success) {
        throw new Error(responseMessage);
      }

      const decryptedData = decryptData(data);
      let studentData = decryptedData.data || [];

      if (!Array.isArray(studentData)) {
        setMessage('Invalid data format received from server.');
        setStudents([]);
        return;
      }

      let filteredStudents = studentData;
      if (courseCode) {
        filteredStudents = filteredStudents.filter(
          (student) =>
            student.course_code === courseCode ||
            student.branch === selectedBranch ||
            student.course === selectedBranch
        );
      }
      if (admissionYear) {
        filteredStudents = filteredStudents.filter(
          (student) =>
            student.admission_year === admissionYear ||
            student.admission_year === parseInt(admissionYear) ||
            student.batch === selectedBatch ||
            (student.roll_no && student.roll_no.includes(admissionYear.toString().slice(-2)))
        );
      }

      const sanitizedData = filteredStudents.map((student) => {
        let filteredSemesters = [];

        if (Array.isArray(student.semesters)) {
          if (selectedSemester === 'OVERALL') {
            filteredSemesters = student.semesters;
          } else {
            const targetSemesterNo = selectedSemester.split(' ')[1];
            filteredSemesters = student.semesters.filter(
              (sem) =>
                sem.semester_no == targetSemesterNo ||
                sem.semester_no === parseInt(targetSemesterNo) ||
                sem.semester === targetSemesterNo ||
                sem.semester === parseInt(targetSemesterNo)
            );
          }
        }

        return {
          ...student,
          semesters: filteredSemesters.map((sem) => ({
            ...sem,
            sgpa: sem.sgpa !== undefined ? parseFloat(sem.sgpa) : 0,
            percentage: sem.percentage !== undefined ? parseFloat(sem.percentage) : 0,
            credit_percentage: sem.credit_percentage !== undefined ? parseFloat(sem.credit_percentage) : 0,
            total_marks: sem.total_marks !== undefined ? parseFloat(sem.total_marks) : 0,
            max_marks: sem.max_marks !== undefined ? parseFloat(sem.max_marks) : 0,
            total_credit_marks: sem.total_credit_marks !== undefined ? parseFloat(sem.total_credit_marks) : 0,
            max_credit_marks: sem.max_credit_marks !== undefined ? parseFloat(sem.max_credit_marks) : 0,
            total_credits: sem.total_credits !== undefined ? parseFloat(sem.total_credits) : 0,
            max_credits: sem.max_credits !== undefined ? parseFloat(sem.max_credits) : 0,
            semester_no: sem.semester_no ? sem.semester_no.toString() : '0',
          })),
        };
      });

      const finalFilteredData = sanitizedData.filter(
        (student) => student.semesters && student.semesters.length > 0
      );

      setStudents(finalFilteredData);
      setSearchQuery('');

      if (finalFilteredData.length === 0) {
        setMessage('No student data found for the selected options.');
      }
    } catch (err) {
      console.error('API Error Details:', {
        message: err.message,
        status: err.response?.status,
        responseData: err.response?.data,
        axiosError: err.toJSON ? err.toJSON() : err,
      });
      const errorMessage =
        err.response?.data?.message || err.message || 'Error fetching data. Please try again later.';
      setMessage(errorMessage);
      setStudents([]);
      setSearchQuery('');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedBranch('');
    setSelectedBatch('');
    setSelectedSemester('');
    setStudents(null);
    setSearchQuery('');
    setRankingCriteria('sgpa');
    setIsSubmitted(false);
    setMessage('');
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
  };

  const closeReport = () => {
    setSelectedStudent(null);
  };

  const branchToCourseCode = {
    CSE: '027',
    AIML: '116',
    AIDS: '119',
    CST: '127',
    BBA: '017',
    BCA: '020',
    BCOM: '888',
  };

  const courseCode = selectedBranch ? branchToCourseCode[selectedBranch] : '';

  return (
    <div className="w-full max-w-full min-h-screen bg-black text-white px-2 sm:px-4 lg:px-6 pt-20">
      <div className="flex flex-col items-center justify-center text-center w-full">
        <div className="w-full">
          <FilterForm
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            selectedBatch={selectedBatch}
            setSelectedBatch={setSelectedBatch}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            onSubmit={handleSubmit}
            onClear={handleClearFilters}
            loading={loading}
            courseCode={courseCode}
          />
        </div>
        {message && (
          <p
            className={`mt-4 ${message.includes('Error')
                ? 'text-red-400'
                : message.includes('Found')
                  ? 'text-green-400'
                  : 'text-blue-400'
              }`}
          >
            {message}
          </p>
        )}
        {loading ? (
          <LoadingSpinner />
        ) : isSubmitted && students && students.length > 0 ? (
          <div className="w-full">
            <StudentTable
              students={students}
              selectedSemester={selectedSemester}
              rankingCriteria={rankingCriteria}
              setRankingCriteria={setRankingCriteria}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onRowClick={handleRowClick}
              loading={loading}
              courseCode={courseCode}
            />
          </div>
        ) : isSubmitted ? (
          <p className="mt-4 text-white">No student data found for the selected options.</p>
        ) : (
          ''
        )}
        {selectedStudent && (
          <StudentReportModal
            student={selectedStudent}
            selectedSemester={selectedSemester}
            branch={selectedBranch}
            batch={selectedBatch}
            onClose={closeReport}
          />
        )}
      </div>
    </div>
  );
};

export default Ranklists;