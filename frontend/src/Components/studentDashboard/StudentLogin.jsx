import React from "react";

const StudentLogin = ({ enrollmentNo, setEnrollmentNo, handleSubmit, loading, handleClose, showForm }) => {
    return (
        <div className="rounded-lg h-screen p-2 flex overflow-y-hidden items-center flex-col shadow-lg flex-grow bg-black text-white">
            {showForm ? (
                <form onSubmit={handleSubmit}
                    className="w-96 border border-zinc-800 p-5 mt-32 bg-black rounded-lg"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Student Profile Dashboard</h2>
                        <button
                            type="button"
                            className="text-zinc-400 cursor-pointer hover:text-white text-2xl leading-none"
                            onClick={handleClose}
                        >
                            ×
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-white">Enrollment No.</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-black border border-zinc-700 text-white rounded focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            placeholder="Enter Enrollment No."
                            value={enrollmentNo || ""}
                            onChange={(e) => setEnrollmentNo(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-8 py-1 bg-white text-black font-bold text-lg uppercase tracking-wider border-2 border-white transition-all duration-300 transform hover:scale-105 hover:bg-black hover:text-white active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'cursor-pointer'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                Loading...
                            </div>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </form>
            ) : (
                <div className="flex items-center justify-center mt-32">
                    <p className="text-zinc-400">Form is not visible</p>
                </div>
            )}
        </div>
    );
};

export default StudentLogin;