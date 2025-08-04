import React from "react";

const Dropdown = ({ showDropdown, visibleColumns, toggleColumn }) => {
    return (
        showDropdown && (
            <div className="absolute left-0 mt-2 w-40 bg-zinc-800 z-[100] rounded-lg shadow-lg border border-zinc-700">
                {Object.keys(visibleColumns).map((column) => (
                    <label 
                        key={column} 
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-zinc-700 cursor-pointer transition-colors duration-200"
                    >
                        <input
                            type="checkbox"
                            checked={visibleColumns[column]}
                            onChange={() => toggleColumn(column)}
                            className="mr-2 accent-zinc-500"
                        />
                        <span className="flex-1">{column}</span>
                        <svg 
                            className="w-4 h-4 ml-2 text-zinc-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </label>
                ))}
            </div>
        )
    );
};

export default Dropdown;