import React, { useEffect, useState } from "react";
import programConfig from "../../data/programConfig.json";

const FilterForm = ({
  selectedBranch,
  setSelectedBranch,
  selectedBatch,
  setSelectedBatch,
  selectedSemester,
  setSelectedSemester,
  onSubmit,
  onClear,
  loading,
  courseCode,
}) => {
  const [selectedProgram, setSelectedProgram] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBranch || !selectedBatch || !selectedSemester) {
      alert("Please select a branch, batch, and semester.");
      return;
    }

    const admissionYear = selectedBatch.split("-")[0];
    const semesterNo = selectedSemester === "OVERALL" ? "OVERALL" : selectedSemester.split(" ")[1];

    const submitData = {
      courseCode,
      admissionYear,
      semesterNo,
    };

    onSubmit(submitData);
  };

  const handleClear = () => {
    setSelectedBranch("");
    setSelectedBatch("");
    setSelectedSemester("");
    setSelectedProgram("");
    onClear();
  };

  useEffect(() => {
    setSelectedBranch("");
    setSelectedBatch("");
    setSelectedSemester("");
  }, [selectedProgram]);

  const { programLabels, programBranchMap, programBatchMap, semesterMap, branchLabels } = programConfig;
  const availableBranches = programBranchMap[selectedProgram] || [];
  const availableBatches = programBatchMap[selectedProgram] || [];
  const availableSemesters = semesterMap[selectedProgram] || [];

  return (
    <div className=" bg-black p-1">
      <div className="w-full max-w-8xl mx-auto bg-black border-2 border-zinc-900 p-4 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Student Ranklist</h2>
          <div className="w-24 h-0.5 bg-white mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Program Select */}
          <div className="relative">
            <select
              className="w-full p-4 text-white bg-black border-2 border-zinc-800 font-medium appearance-none cursor-pointer focus:outline-none focus:border-white transition-all"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              disabled={loading}
            >
              <option disabled value="">
                Select Program
              </option>
              {Object.keys(programLabels).map((prog) => (
                <option key={prog} value={prog} className="bg-black">
                  {programLabels[prog]}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Branch Select */}
          <div className="relative">
            <select
              className="w-full p-4 text-white bg-black border-2 border-zinc-800 font-medium appearance-none cursor-pointer focus:outline-none focus:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={loading || !selectedProgram}
            >
              <option disabled value="">
                Select Branch
              </option>
              {availableBranches.map((branch) => (
                <option key={branch} value={branch} className="bg-black">
                  {branchLabels[branch]}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Batch Select */}
          <div className="relative">
            <select
              className="w-full p-4 text-white bg-black border-2 border-zinc-800 font-medium appearance-none cursor-pointer focus:outline-none focus:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              disabled={loading || !selectedProgram}
            >
              <option disabled value="">
                Select Batch
              </option>
              {availableBatches.map((batch) => (
                <option key={batch} value={batch} className="bg-black">
                  {batch}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Semester Select */}
          <div className="relative">
            <select
              className="w-full p-4 text-white bg-black border-2 border-zinc-800 font-medium appearance-none cursor-pointer focus:outline-none focus:border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              disabled={loading || !selectedProgram}
            >
              <option disabled value="">
                Select Semester
              </option>
              {availableSemesters.map((sem) => (
                <option key={sem} value={sem} className="bg-black">
                  {sem === "OVERALL" ? "OVERALL" : `SEMESTER ${sem.split(" ")[1] || sem}`}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-2 bg-white text-black font-bold text-lg uppercase tracking-wider border-2 border-white transition-all duration-300 transform hover:scale-105 hover:bg-black hover:text-white active:scale-95 ${
              loading ? "opacity-50 cursor-not-allowed hover:scale-100" : "cursor-pointer"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : (
              "Submit"
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className={`px-8 py-2 bg-black text-white font-bold text-lg uppercase tracking-wider border-2 border-white transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black active:scale-95 ${
              loading ? "opacity-50 cursor-not-allowed hover:scale-100" : "cursor-pointer"
            }`}
          >
            Clear All
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white"></div>
            <div className="w-2 h-2 bg-white"></div>
            <div className="w-2 h-2 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;