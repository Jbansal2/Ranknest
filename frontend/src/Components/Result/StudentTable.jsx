import React, { useMemo } from 'react';
import 'remixicon/fonts/remixicon.css'

const StudentTable = ({
  students,
  selectedSemester,
  rankingCriteria,
  setRankingCriteria,
  searchQuery,
  setSearchQuery,
  onRowClick,
  loading,
  courseCode,
}) => {
  const getMetrics = (student, semesterNo) => {
    if (!student || !Array.isArray(student.semesters)) return {};
    const sem = semesterNo === 'OVERALL'
      ? student.semesters
      : student.semesters.find((s) => s.semester_no.toString() === semesterNo.toString());

    if (!sem) return {};
    const isOverall = Array.isArray(sem);
    const total = {
      sgpa: 0,
      percentage: 0,
      credit_percentage: 0,
      total_marks: 0,
      max_marks: 0,
      total_credit_marks: 0,
      max_credit_marks: 0,
      total_credits: 0,
      max_credits: 0,
      count: 0
    };

    const entries = isOverall ? sem : [sem];

    entries.forEach((s) => {
      total.sgpa += parseFloat(s.sgpa || 0);
      total.percentage += parseFloat(s.percentage || 0);
      total.credit_percentage += parseFloat(s.credit_percentage || 0);
      total.total_marks += parseFloat(s.total_marks || 0);
      total.max_marks += parseFloat(s.max_marks || 0);
      total.total_credit_marks += parseFloat(s.total_credit_marks || 0);
      total.max_credit_marks += parseFloat(s.max_credit_marks || 0);
      total.total_credits += parseFloat(s.total_credits || 0);
      total.max_credits += parseFloat(s.max_credits || 0);
      total.count += 1;
    });

    return {
      sgpa: isOverall ? (total.sgpa / total.count).toFixed(3) : parseFloat(entries[0]?.sgpa || 0).toFixed(3),
      percentage: total.max_marks ? ((total.total_marks / total.max_marks) * 100).toFixed(3) : '0.000',
      credit_percentage: total.max_credit_marks ? ((total.total_credit_marks / total.max_credit_marks) * 100).toFixed(3) : '0.000',
      total_marks: total.total_marks.toFixed(0),
      max_marks: total.max_marks.toFixed(0),
      total_credits: total.total_credits.toFixed(0),
      max_credits: total.max_credits.toFixed(0),
    };
  };

  const rankedStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];

    const semesterNo = selectedSemester === 'OVERALL' ? 'OVERALL' : selectedSemester.split(' ')[1];
    const validStudents = students.filter((student) => {
      if (!student || !Array.isArray(student.semesters) || student.course_code !== courseCode) {
        return false;
      }
      if (semesterNo === 'OVERALL') {
        return student.semesters.length > 0;
      }
      return student.semesters.some((s) => s.semester_no.toString() === semesterNo.toString());
    });

    const sorted = validStudents
      .map((student) => {
        const metrics = getMetrics(student, semesterNo);
        return { ...student, metrics };
      })
      .sort((a, b) => parseFloat(b.metrics[rankingCriteria]) - parseFloat(a.metrics[rankingCriteria]));

    let currentRank = 1;
    return sorted.map((student, index, arr) => {
      if (index > 0) {
        const prev = arr[index - 1];
        if (parseFloat(student.metrics[rankingCriteria]) !== parseFloat(prev.metrics[rankingCriteria])) {
          currentRank = index + 1;
        }
      }
      return { ...student, rank: currentRank };
    });
  }, [students, selectedSemester, rankingCriteria, courseCode]);

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rankedStudents;
    return rankedStudents.filter((student) =>
      student.name?.toLowerCase().includes(query) ||
      student.enroll_no?.toLowerCase().includes(query)
    );
  }, [rankedStudents, searchQuery]);

  const topThree = rankedStudents.slice(0, 3);
  const remainingStudents = filteredStudents.filter(student =>
    !topThree.some(top => top.enroll_no === student.enroll_no)
  );

  return (
    <div className="mt-8 w-full bg-black text-white">
      {!students || students.length === 0 ? (
        <div className="text-center p-12 border-2 border-zinc-800">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-2xl font-bold uppercase tracking-wider">Select Filters & Submit</p>
          <p className="mt-2">To view student results</p>
        </div>
      ) : (
        <div className="w-full space-y-8">
          <div className="bg-black text-white p-2">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full p-4 bg-black text-white border-2 border-zinc-800 font-medium placeholder-gray-400 focus:outline-none \ transition-all duration-300"
                  placeholder="Search by name or enrollment number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="lg:w-64">
                <select
                  className="w-full p-4 bg-black text-white border-2 border-zinc-800 font-bold uppercase tracking-wider appearance-none cursor-pointer focus:outline-none  transition-all duration-300"
                  value={rankingCriteria}
                  onChange={(e) => setRankingCriteria(e.target.value)}
                  disabled={loading}
                >
                  <option value="sgpa"><i class="ri-search-line"></i> SGPA RANKING</option>
                  <option value="percentage">PERCENTAGE RANKING</option>
                  <option value="credit_percentage">CREDIT % RANKING</option>
                </select>
              </div>
            </div>
          </div>

          {/* Top 3 */}
          {rankedStudents.length > 0 && (
            <>
              <div className="bg-black text-white p-6">
                <h3 className="text-2xl font-bold uppercase tracking-wider text-center mb-6">
                  🏆 TOP PERFORMERS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topThree.map((student, index) => (
                    <div
                      key={student.enroll_no}
                      className="bg-black text-white p-3 border-2 border-zinc-800 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                      onClick={() => onRowClick(student)}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div className="text-3xl font-bold mb-2">#{student.rank}</div>
                        <h4 className="font-bold text-lg mb-2 uppercase tracking-wide">
                          {student.name}
                        </h4>
                        <p className="text-sm mb-3 font-mono">{student.enroll_no}</p>
                        <div className="border-t-2 border-white pt-3">
                          <p className="text-2xl font-bold">
                            {rankingCriteria === 'sgpa'
                              ? student.metrics.sgpa
                              : rankingCriteria === 'percentage'
                                ? `${student.metrics.percentage}%`
                                : `${student.metrics.credit_percentage}%`}
                          </p>
                          <p className="text-sm uppercase tracking-wider">
                            {rankingCriteria === 'sgpa' ? 'SGPA' :
                              rankingCriteria === 'percentage' ? 'PERCENTAGE' : 'CREDIT %'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search or Full Table */}
              {(searchQuery.trim() ? filteredStudents : remainingStudents).length > 0 ? (
                <div className="bg-black text-white p-3">
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
                    {searchQuery.trim()
                      ? `🔍 Search Results (${filteredStudents.length} found)`
                      : ''}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-2 border-zinc-800">
                      <thead>
                        <tr className="bg-black text-white border-b-1">
                          <th className="p-4 font-bold uppercase tracking-wide">Rank</th>
                          <th className="p-4 font-bold uppercase tracking-wide">Enrollment No</th>
                          <th className="p-4 font-bold uppercase tracking-wide text-left">Name</th>
                          <th className="p-4 font-bold uppercase tracking-wide">Marks</th>
                          <th className="p-4 font-bold uppercase tracking-wide">
                            {rankingCriteria === 'sgpa' ? 'SGPA' :
                              rankingCriteria === 'percentage' ? 'PERCENTAGE' : 'CREDIT %'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(searchQuery.trim() ? filteredStudents : remainingStudents).map((student, index) => (
                          <tr
                            key={student.enroll_no}
                            className={`border-b-2 border-zinc-800 cursor-pointer transition-all duration-300 ${index % 2 === 0 ? 'bg-black' : 'bg-neutral-900'
                              } hover:bg-neutral-700`}
                            onClick={() => onRowClick(student)}
                          >
                            <td className="p-4 font-bold text-center">#{student.rank}</td>
                            <td className="p-4 font-mono">{student.enroll_no}</td>
                            <td className="p-4 font-semibold text-left">{student.name}</td>
                            <td className="p-4 text-center">
                              {student.metrics.total_marks !== '0'
                                ? `${student.metrics.total_marks}/${student.metrics.max_marks}`
                                : 'N/A'}
                            </td>
                            <td className="p-4 text-center font-bold text-lg">
                              {rankingCriteria === 'sgpa'
                                ? student.metrics.sgpa
                                : rankingCriteria === 'percentage'
                                  ? `${student.metrics.percentage}%`
                                  : `${student.metrics.credit_percentage}%`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 border-2 border-white">
                  <div className="text-4xl mb-4">❌</div>
                  <p className="text-xl font-bold">NO MATCHES FOUND</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentTable;
