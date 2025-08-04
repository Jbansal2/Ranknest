import React from "react";
import { ChevronDown, Table2, Settings, Database } from "lucide-react";

const ResultTable = ({ title, data = [], visibleColumns = {}, toggleColumn, showDropdown, setShowDropdown, dropdownRef }) => {
    const hasData = data && data.length > 0;
    const visibleColumnKeys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    return (
        <div className="group relative bg-black border-2 border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-white/10">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

            {/* Header */}
            <div className="relative z-10 bg-zinc-900/50 border-b border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg group-hover:bg-white/10 transition-colors duration-300">
                            <Table2 className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors duration-300">
                            {title}
                        </h3>
                    </div>

                    {/* Column Toggle Dropdown */}
                    <div className="relative z-[100]" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="group/btn flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/30 relative z-[100]"
                        >
                            <Settings className="w-4 h-4" />
                            Columns
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 cursor-pointer bg-black border-2 border-zinc-700 rounded-xl shadow-2xl z-[200] overflow-hidden">
                                <div className="p-2 relative z-[200]">
                                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2">
                                        Toggle Columns
                                    </div>
                                    {Object.keys(visibleColumns).map((column) => (
                                        <label
                                            key={column}
                                            className="flex items-center px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-200 relative z-[200]"
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={visibleColumns[column]}
                                                    onChange={() => toggleColumn(column)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${visibleColumns[column] ? 'bg-white border-white' : 'border-zinc-500'}`}>
                                                    {visibleColumns[column] && (
                                                        <svg className="w-3 h-3 text-black absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="ml-3">{column}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="relative z-[5] p-6 ">
                {hasData ? (
                    <div className="overflow-x-auto">
                        <div className="min-w-full">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-zinc-800">
                                        {visibleColumns.Sem && (
                                            <th className="py-4 px-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                Semester
                                            </th>
                                        )}
                                        {visibleColumns.Marks && (
                                            <th className="py-4 px-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                Marks
                                            </th>
                                        )}
                                        {visibleColumns.Percentage && (
                                            <th className="py-4 px-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                Percentage
                                            </th>
                                        )}
                                        {visibleColumns["C. Marks"] && (
                                            <th className="py-4 px-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                Credit Marks
                                            </th>
                                        )}
                                        {visibleColumns["C. Percentage"] && (
                                            <th className="py-4 px-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                Credit %
                                            </th>
                                        )}
                                        {(visibleColumns.SGPA || visibleColumns.CGPA) && (
                                            <th className="py-4 px-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                {visibleColumns.SGPA ? "SGPA" : "CGPA"}
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {data.map((result, index) => (
                                        <tr
                                            key={index}
                                            className="group/row hover:bg-white/5 transition-colors duration-200"
                                        >
                                            {visibleColumns.Sem && (
                                                <td className="py-4 px-4 text-white font-medium">
                                                    {result.semester}
                                                </td>
                                            )}
                                            {visibleColumns.Marks && (
                                                <td className="py-4 px-4 text-white font-medium">
                                                    {result.marks}
                                                </td>
                                            )}
                                            {visibleColumns.Percentage && (
                                                <td className="py-4 px-4 text-white font-medium">
                                                    {result.percentage}%
                                                </td>
                                            )}
                                            {visibleColumns["C. Marks"] && (
                                                <td className="py-4 px-4 text-white font-medium">
                                                    {result.credit_marks}
                                                </td>
                                            )}
                                            {visibleColumns["C. Percentage"] && (
                                                <td className="py-4 px-4 text-white font-medium">
                                                    {result.credit_percentage}%
                                                </td>
                                            )}
                                            {(visibleColumns.SGPA || visibleColumns.CGPA) && (
                                                <td className="py-4 px-4 text-white font-medium">
                                                    {result.sgpa || result.cgpa}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-full mb-4">
                            <Database className="w-8 h-8 text-zinc-500" />
                        </div>
                        <p className="text-zinc-400 text-lg font-medium mb-2">
                            No Data Available
                        </p>
                        <p className="text-zinc-500 text-sm">
                            No semester data available to display.
                        </p>
                    </div>
                )}
            </div>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
        </div>
    );
};

export default ResultTable;