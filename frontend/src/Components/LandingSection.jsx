import React, { useState } from 'react';
import Image from '../assets/contact.svg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LandingSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }
    if (!formData.subject.trim()) {
      setError('Please enter a subject.');
      setLoading(false);
      return;
    }
    if (formData.message.length < 10) {
      setError('Message should be at least 10 characters long.');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/api/auth/queries`, formData);

      if (response.status === 200) {
        toast.success('Form submitted successfully!');
        setFormData({ name: '', email: '', message: '', subject: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', {
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });

      let errorMessage = 'Failed to submit the form. Please try again.';
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Invalid data provided. Please check your input.';
        } else if (error.response.status === 404) {
          errorMessage = 'API endpoint not found. Please contact support.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white h-auto flex justify-center px-4 sm:px-6 lg:px-5">
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[85%]">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
          Have questions, suggestions, or facing any issues?
        </h1>
        {/* Main Content */}
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-4 sm:gap-5">
              <input
                type="text"
                name="name"
                placeholder="Enter your name*"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-zinc-700 text-white placeholder-zinc-400 rounded-md focus:outline-none text-sm sm:text-base"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Enter your email*"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-zinc-700 text-white placeholder-zinc-400 rounded-md focus:outline-none text-sm sm:text-base"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Enter subject*"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-zinc-700 text-white placeholder-zinc-400 rounded-md focus:outline-none text-sm sm:text-base"
                required
              />
              <textarea
                name="message"
                placeholder="Enter your message*"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-zinc-700 text-white placeholder-zinc-400 rounded-md focus:outline-none text-sm sm:text-base resize-none h-24 sm:h-32"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-white text-black font-semibold cursor-pointer py-3 px-6 rounded w-full sm:w-auto sm:px-8 transition duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          {/* Illustration Placeholder */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <img
              src={Image}
              alt="Contact Us Illustration"
              className="w-full h-auto max-w-[90%] sm:max-w-[80%] lg:max-w-[90%]"
            />
            <div />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingSection;