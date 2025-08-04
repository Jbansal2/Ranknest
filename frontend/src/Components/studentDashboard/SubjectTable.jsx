import React from 'react';

const SubjectTable = ({ subjects }) => {
    const getGradeColor = (grade) => {
        if (grade === 'A+' || grade === 'A') return 'bg-green-500/20 text-green-400';
        if (grade === 'B+' || grade === 'B') return 'bg-blue-500/20 text-blue-400';
        if (grade === 'C+' || grade === 'C') return 'bg-yellow-500/20 text-yellow-400';
        if (grade === 'F') return 'bg-red-500/20 text-red-400';
        return 'bg-zinc-500/20 text-zinc-400';
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-[800px] w-full border-separate border-spacing-0">
                <thead>
                    <tr className="bg-zinc-800/50 text-center">
                        <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300 whitespace-nowrap">Paper ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300 whitespace-nowrap">Subject</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300 whitespace-nowrap">Credits</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300 whitespace-nowrap">Internal</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300 whitespace-nowrap">External</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-zinc-300 whitespace-nowrap">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-zinc-300 whitespace-nowrap">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject, index) => (
                        <tr key={subject._id || index} className="border-t border-zinc-700/50 hover:bg-zinc-700/20 transition-colors">
                            <td className="px-2 py-3 whitespace-nowrap">
                                <span className="text-sm font-mono text-left text-zinc-400 bg-zinc-700/30 px-2 py-1 rounded">
                                    {subject.paper_id || subject.subject_code || 'N/A'}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                    <span className="text-white text-sm text-left">{subject.name || subject.subject_name || 'Unknown'}</span>
                                    {(subject.grade || "0") === "F" && (
                                        <span className="inline-flex items-center gap-1 mt-1 sm:mt-0 px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-medium w-fit">
                                            Backlog
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="text-center whitespace-nowrap">
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-white text-left text-sm font-medium">
                                    {subject.credits || 0}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-zinc-300 text-center font-medium whitespace-nowrap">
                                {subject.minor || subject.minor_marks || 0}
                            </td>
                            <td className="px-4 py-3 text-zinc-300 text-center font-medium whitespace-nowrap">
                                {subject.major || subject.major_marks || 0}
                            </td>
                            <td className="px-4 py-3 text-white text-center font-bold whitespace-nowrap">
                                {subject.marks || 0}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 rounded-md text-sm font-medium ${getGradeColor(subject.grade)}`}>
                                    {subject.grade || 'N/A'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubjectTable;
