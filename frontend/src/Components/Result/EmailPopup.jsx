import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailPopup = ({ student, metrics, semesters, subjects, branch, batch, selectedSemester, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL; 
      const response = await axios.post(
        `${apiUrl}/api/auth/email/send-result`,
        {
          email,
          student: {
            enroll_no: student.enroll_no,
            name: student.name,
            rank: student.rank,
            metrics,
            semesters,
            subjects,
            branch,
            batch,
            selectedSemester,
          },
        },
        {
          timeout: 10000, // 10 seconds timeout
        }
      );
      toast.success(response.data.message || 'Result emailed successfully!');
      setEmail('');
      onClose();
    } catch (err) {
      console.error('Error sending email:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Failed to send email. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-zinc-900 text-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl text-left font-bold">Send Result via Email</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-sm sm:text-base text-left">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white outline-none min-h-[44px]  text-xs sm:text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="flex justify-end  space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded transition duration-200 min-h-[44px] focus:ring-2  text-xs sm:text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded transition duration-200 min-h-[44px] focus:ring-2  text-xs sm:text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailPopup;