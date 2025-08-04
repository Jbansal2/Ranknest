import React from 'react';

const StudentProfile = ({ student, onClose, getRankIcon, getRankLabel }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Student Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-2 text-sm mb-6">
          <p>
            <span className="font-semibold">Enrollment:</span> {student.enrollmentId}
          </p>
          <p>
            <span className="font-semibold">Name:</span>{' '}
            {getRankLabel(student.rank, student.name)}{' '}
            {getRankIcon(student.rank)}
          </p>
          <p>
            <span className="font-semibold">Branch:</span> {student.branch}
          </p>
          <p>
            <span className="font-semibold">Year:</span> {student.year}
          </p>
          <p>
            <span className="font-semibold">Semester:</span> {student.semester}
          </p>
          <div className="flex gap-10 flex-wrap">
            <p>
              <span className="font-semibold">Total Marks:</span> {student.totalMarks}
            </p>
            <p>
              <span className="font-semibold">Marks Obtained:</span>{' '}
              {student.marksObtained}
            </p>
          </div>
          <div className="flex gap-10 flex-wrap">
            <p>
              <span className="font-semibold">Total Credits:</span>{' '}
              {student.totalCredits}
            </p>
            <p>
              <span className="font-semibold">Credits Obtained:</span>{' '}
              {student.creditsObtained}
            </p>
          </div>
          <div className="flex gap-10 flex-wrap">
            <p>
              <span className="font-semibold">Percentage:</span> {student.percentage}%
            </p>
            <p>
              <span className="font-semibold">Division:</span> {student.division}
            </p>
          </div>
          <div className="flex gap-10 flex-wrap">
            <p>
              <span className="font-semibold">Rank:</span> {student.rank}
            </p>
            <p>
              <span className="font-semibold">SGPA:</span> {student.cgpa}
            </p>
          </div>

          {/* Subject Details Table */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Subject Details</h3>
            {student.subjects && student.subjects.length > 0 ? (
              <table className="w-full border border-gray-600 text-xs sm:text-sm text-white rounded-md">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-2 border-b border-gray-600">Subject Code</th>
                    <th className="p-2 border-b border-gray-600">Subject Name</th>
                    <th className="p-2 border-b border-gray-600">Int.</th>
                    <th className="p-2 border-b border-gray-600">Ext.</th>
                    <th className="p-2 border-b border-gray-600">Total</th>
                    <th className="p-2 border-b border-gray-600">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {student.subjects.map((subject, index) => (
                    <tr key={index} className="text-center hover:bg-gray-700">
                      <td className="p-2 border-b border-gray-600">{subject.subjectCode}</td>
                      <td className="p-2 border-b border-gray-600">{subject.subjectName}</td>
                      <td className="p-2 border-b border-gray-600">{subject.internal}</td>
                      <td className="p-2 border-b border-gray-600">{subject.external}</td>
                      <td className="p-2 border-b border-gray-600">{subject.totalMarks}</td>
                      <td className="p-2 border-b border-gray-600">{subject.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 text-sm italic text-center">
                No subject details available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;