import React, { useState } from 'react';
import { X, Mail, Trophy, Award, Star, User, GraduationCap, TrendingUp, Calendar, BookOpen, Target } from 'lucide-react';
const StudentReportModal = ({ student, selectedSemester, onClose, branch, batch }) => {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const semesterNo = selectedSemester === 'OVERALL' ? 'OVERALL' : selectedSemester.split(' ')[1];

  const getMetrics = (student, semesterNo) => {
    if (!student || !Array.isArray(student.semesters)) {
      return {
        sgpa: '0.000',
        percentage: '0.000',
        credit_percentage: '0.000',
        total_marks: '0.000',
        max_marks: '0.000',
        total_credit_marks: '0.000',
        max_credit_marks: '0.000',
        total_credits: '0.000',
        max_credits: '0.000',
      };
    }

    if (semesterNo === 'OVERALL') {
      const validSemesters = student.semesters.filter(
        (sem) =>
          sem &&
          sem.semester_no &&
          sem.sgpa !== undefined &&
          !isNaN(parseFloat(sem.sgpa))
      );

      if (validSemesters.length === 0) {
        return {
          sgpa: '0.000',
          percentage: '0.000',
          credit_percentage: '0.000',
          total_marks: '0.000',
          max_marks: '0.000',
          total_credit_marks: '0.000',
          max_credit_marks: '0.000',
          total_credits: '0.000',
          max_credits: '0.000',
        };
      }

      const total = validSemesters.reduce(
        (acc, sem) => ({
          total_marks: acc.total_marks + (parseFloat(sem.total_marks) || 0),
          max_marks: acc.max_marks + (parseFloat(sem.max_marks) || 0),
          total_credit_marks: acc.total_credit_marks + (parseFloat(sem.total_credit_marks) || 0),
          max_credit_marks: acc.max_credit_marks + (parseFloat(sem.max_credit_marks) || 0),
          total_credits: acc.total_credits + (parseFloat(sem.total_credits) || 0),
          max_credits: acc.max_credits + (parseFloat(sem.max_credits) || 0),
          sgpa: acc.sgpa + (parseFloat(sem.sgpa) || 0),
          count: acc.count + (sem.sgpa !== undefined && !isNaN(parseFloat(sem.sgpa)) ? 1 : 0),
        }),
        {
          total_marks: 0,
          max_marks: 0,
          total_credit_marks: 0,
          max_credit_marks: 0,
          total_credits: 0,
          max_credits: 0,
          sgpa: 0,
          count: 0,
        }
      );

      return {
        sgpa: total.count > 0 ? (total.sgpa / total.count).toFixed(3) : '0.000',
        percentage: total.max_marks > 0 ? ((total.total_marks / total.max_marks) * 100).toFixed(3) : '0.000',
        credit_percentage: total.max_credit_marks > 0 ? ((total.total_credit_marks / total.max_credit_marks) * 100).toFixed(3) : '0.000',
        total_marks: total.max_marks > 0 ? total.total_marks : '0.000',
        max_marks: total.max_marks > 0 ? total.max_marks : '0.000',
        total_credit_marks: total.max_credit_marks > 0 ? total.total_credit_marks : '0.000',
        max_credit_marks: total.max_credit_marks > 0 ? total.max_credit_marks : '0.000',
        total_credits: total.max_credits > 0 ? total.total_credits : '0.000',
        max_credits: total.max_credits > 0 ? total.max_credits : '0.000',
      };
    }

    const sem = student.semesters.find((s) => s.semester_no.toString() === semesterNo.toString()) || {};
    return {
      sgpa: sem.sgpa !== undefined ? parseFloat(sem.sgpa).toFixed(3) : '0.000',
      percentage: sem.percentage !== undefined ? parseFloat(sem.percentage).toFixed(3) : '0.000',
      credit_percentage: sem.credit_percentage !== undefined ? parseFloat(sem.credit_percentage).toFixed(3) : '0.000',
      total_marks: sem.total_marks !== undefined ? parseFloat(sem.total_marks) : '0.000',
      max_marks: sem.max_marks !== undefined ? parseFloat(sem.max_marks) : '0.000',
      total_credit_marks: sem.total_credit_marks !== undefined ? parseFloat(sem.total_credit_marks) : '0.000',
      max_credit_marks: sem.max_credit_marks !== undefined ? parseFloat(sem.max_credit_marks) : '0.000',
      total_credits: sem.total_credits !== undefined ? parseFloat(sem.total_credits) : '0.000',
      max_credits: sem.max_credits !== undefined ? parseFloat(sem.max_credits) : '0.000',
    };
  };

  const metrics = getMetrics(student, semesterNo);
  const selectedSemesterData =
    selectedSemester === 'OVERALL'
      ? student.semesters || []
      : (student.semesters?.find((sem) => sem.semester_no.toString() === semesterNo.toString()) || {});
  const subjects = selectedSemester === 'OVERALL' ? [] : selectedSemesterData.subjects || [];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Star className="w-5 h-5 text-orange-400" />;
    return null;
  };

  const getPerformanceColor = (percentage) => {
    const perc = parseFloat(percentage);
    if (perc >= 85) return 'text-green-400';
    if (perc >= 70) return 'text-blue-400';
    if (perc >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'bg-green-500/20 text-green-400';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-500/20 text-blue-400';
    if (grade === 'C+' || grade === 'C') return 'bg-yellow-500/20 text-yellow-400';
    if (grade === 'F') return 'bg-red-500/20 text-red-400';
    return 'bg-zinc-500/20 text-zinc-400';
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-zinc-800 text-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-4 border-b border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-sm font-bold text-left text-white">Student Report</h2>
                <p className="text-zinc-400 text-left text-sm">Academic Performance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center justify-center cursor-pointer w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          {/* Student Info Card */}
          <div className="p-1 border-b border-zinc-800">
            <div className=" border border-zinc-900 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black rounded-xl border-zinc-700 border flex items-center justify-center">
                    <User className="w-8 h-8 text-white " />
                  </div>
                  <div>
                    <h3 className="text-md sm:text-sm text-left text-white">{student.name || 'Unknown'}</h3>
                    <p className="text-zinc-400 text-left">{student.enroll_no || 'N/A'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-zinc-500"> {branch || 'N/A'}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-sm text-zinc-500">{batch || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                {student.rank && (
                  <div className="flex items-center gap-2 bg-zinc-700/50 px-3 py-2 rounded-lg">
                    {getRankIcon(student.rank)}
                    <span className="font-semibold">#{student.rank}</span>
                  </div>
                )}
              </div>

              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-white" />
                    <span className="text-sm text-zinc-400">SGPA</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metrics.sgpa !== '0.000' ? metrics.sgpa : 'N/A'}
                  </div>
                </div>

                <div className="bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-zinc-400">Percentage</span>
                  </div>
                  <div className={`text-2xl font-bold ${getPerformanceColor(metrics.percentage)}`}>
                    {metrics.percentage !== '0.000' ? `${metrics.percentage}%` : 'N/A'}
                  </div>
                </div>

                <div className="bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-zinc-400">Total Marks</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {metrics.total_marks !== '0.000' ? `${metrics.total_marks}/${metrics.max_marks}` : 'N/A'}
                  </div>
                </div>

                <div className="bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-zinc-400">Credits</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {metrics.total_credits !== '0.000' ? `${metrics.total_credits}/${metrics.max_credits}` : 'N/A'}
                  </div>
                </div>
              </div>


              {/* Credit Performance */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-zinc-400">Credit Marks</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {metrics.total_credit_marks !== '0.000' ? `${metrics.total_credit_marks}/${metrics.max_credit_marks}` : 'N/A'}
                  </div>
                </div>

                <div className="bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-zinc-400">Credit Percentage</span>
                  </div>
                  <div className={`text-lg font-bold ${getPerformanceColor(metrics.credit_percentage)}`}>
                    {metrics.credit_percentage !== '0.000' ? `${metrics.credit_percentage}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {selectedSemester === 'OVERALL' ? (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Semester Overview</h3>
                </div>
                {selectedSemesterData.length > 0 ? (
                  <div className="bg-black rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-black">
                            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300">Semester</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300">SGPA</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300">Marks</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300">Percentage</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300">Credit Marks</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300">Credit %</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300">Credits</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedSemesterData.map((sem, index) => {
                            const semMetrics = getMetrics({ semesters: [sem] }, sem.semester_no.toString());
                            return (
                              <tr key={sem.semester_no || index} className="border-t border-zinc-800/50 hover:bg-zinc-700/20 transition-colors">
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-900 text-white text-sm font-medium">
                                    Sem {sem.semester_no}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-white text-left font-medium">{semMetrics.sgpa !== '0.000' ? semMetrics.sgpa : 'N/A'}</td>
                                <td className="px-4 py-3 text-zinc-300 text-left">
                                  {semMetrics.total_marks !== '0.000' ? `${semMetrics.total_marks}/${semMetrics.max_marks}` : 'N/A'}
                                </td>
                                <td className="px-4 text-left py-3">
                                  <span className={`font-medium text-left ${getPerformanceColor(semMetrics.percentage)}`}>
                                    {semMetrics.percentage !== '0.000' ? `${semMetrics.percentage}%` : 'N/A'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-left text-zinc-300">
                                  {semMetrics.total_credit_marks !== '0.000' ? `${semMetrics.total_credit_marks}/${semMetrics.max_credit_marks}` : 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-left">
                                  <span className={`font-medium ${getPerformanceColor(semMetrics.credit_percentage)}`}>
                                    {semMetrics.credit_percentage !== '0.000' ? `${semMetrics.credit_percentage}%` : 'N/A'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-zinc-300 text-left">
                                  {semMetrics.total_credits !== '0.000' ? `${semMetrics.total_credits}/${semMetrics.max_credits}` : 'N/A'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">No semester data available</p>
                  </div>
                )}
              </div>
            ) : (
              subjects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">Subject Details</h3>
                  </div>
                  <div className="bg-black rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-zinc-800/50 text-center">
                            <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300">Paper ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300">Subject</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300">Credits</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300">Internal</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300">External</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300">Total</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((subject, index) => (
                            <tr key={subject._id || index} className="border-t border-zinc-700/50 hover:bg-zinc-700/20 transition-colors">
                              <td className="px-2 py-3">
                                <span className="text-sm font-mono text-left  text-zinc-400 bg-zinc-700/30 px-2 py-1 rounded">
                                  {subject.paper_id || subject.subject_code || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <span className="text-white text-sm text-left">{subject.name || subject.subject_name || 'Unknown'}</span>
                                  {(subject.grade || "0") === "F" && (
                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-medium w-fit">
                                      Backlog
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-white text-left text-sm font-medium">
                                  {subject.credits || 0}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-zinc-300 font-medium">{subject.minor || subject.minor_marks || 0}</td>
                              <td className="px-4 py-3 text-zinc-300 font-medium">{subject.major || subject.major_marks || 0}</td>
                              <td className="px-4 py-3 text-white font-bold">{subject.marks || 0}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${getGradeColor(subject.grade)}`}>
                                  {subject.grade || 'N/A'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Email Popup would go here */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Email Report</h3>
            <EmailPopup />
            <button
              onClick={() => setShowEmailPopup(false)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentReportModal;