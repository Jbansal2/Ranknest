import React, { useState } from 'react';
import { Users, FileText, Star, X } from 'lucide-react';
import Footer from '../Components/Footer';


const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-zinc-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-zinc-700">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              About Ranknest
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your Rank, Your Nest — Empowering students with real-time academic insights,
              rankings, and comprehensive dashboard solutions.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-6">


          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className="bg-black p-8 rounded-xl border border-zinc-700 hover:border-white transition-all duration-300 group cursor-pointer"
              onClick={() => openModal('github')}
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">GitHub Repository</h3>
              <p className="text-gray-400 mb-6">
                Explore our codebase, contribute features, and help us build better tools for students worldwide.
              </p>
              <button className="text-white hover:text-gray-300 font-medium flex items-center space-x-2">
                <span>View on GitHub</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>

            <div 
              className="bg-black p-8 rounded-xl border border-zinc-700 hover:border-white transition-all duration-300 group cursor-pointer"
              onClick={() => openModal('contributions')}
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                <Users className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Open Source Contributions</h3>
              <p className="text-gray-400 mb-6">
                Join our growing community of developers, educators, and students building the future of academic technology.
              </p>
            </div>

            <div 
              className="bg-black p-8 rounded-xl border border-zinc-700 hover:border-white transition-all duration-300 group cursor-pointer"
              onClick={() => openModal('documentation')}
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors duration-300">
                <FileText className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Documentation</h3>
              <p className="text-gray-400 mb-6">
                Comprehensive guides for developers to integrate Ranknest APIs and contribute to our open source ecosystem.
              </p>
              <button className="text-white hover:text-gray-300 font-medium flex items-center space-x-2">
                <span>Read Docs</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Modal */}
      <Modal
        isOpen={activeModal === 'github'}
        onClose={closeModal}
        title="GitHub Profile & Repository"
      >
        <div className="text-white space-y-6">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Repository Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300 mb-2"><strong>Repository:</strong> Ranknest</p>
                <p className="text-gray-300 mb-2"><strong>Techstack:</strong> React, Node.js, MongoDB, Docker,</p>
                <p className="text-gray-300 mb-2"><strong>License:</strong> MIT</p>
                <p className="text-gray-300 mb-4"><strong>Stars:</strong> 245</p>
              </div>
              <div>
                <p className="text-gray-300 mb-2"><strong>Contributors:</strong> 12</p>
                <p className="text-gray-300 mb-2"><strong>Issues:</strong> 8 open</p>
                <p className="text-gray-300 mb-2"><strong>Pull Requests:</strong> 3 open</p>
                <p className="text-gray-300 mb-4"><strong>Last Updated:</strong> 2 days ago</p>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Recent Commits</h3>
            <div className="space-y-3">
              <div className="border-l-2 border-green-500 pl-4">
                <p className="text-green-400 font-medium">feat: Add real-time ranking updates</p>
                <p className="text-gray-400 text-sm">by @developer123 • 2 days ago</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-blue-400 font-medium">fix: Dashboard loading performance</p>
                <p className="text-gray-400 text-sm">by @codemaster • 4 days ago</p>
              </div>
              <div className="border-l-2 border-yellow-500 pl-4">
                <p className="text-yellow-400 font-medium">docs: Update API documentation</p>
                <p className="text-gray-400 text-sm">by @docwriter • 1 week ago</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-white text-black px-6 py-3 cursor-pointer rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Visit GitHub Repository</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Contributions Modal */}
      <Modal
        isOpen={activeModal === 'contributions'}
        onClose={closeModal}
        title="Contribution Guidelines"
      >
        <div className="text-white space-y-6">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">How to Contribute</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Fork the Repository</h4>
                  <p className="text-gray-300">Create your own copy of the Ranknest repository on GitHub.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Create a Branch</h4>
                  <p className="text-gray-300">Create a new branch for your feature or bug fix.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Make Changes</h4>
                  <p className="text-gray-300">Implement your improvements following our coding standards.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-semibold">Submit Pull Request</h4>
                  <p className="text-gray-300">Submit a detailed pull request with your changes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Contribution Areas</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-400">Frontend Development</h4>
                <p className="text-gray-300 text-sm">React components, UI/UX improvements, responsive design</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-400">Backend Development</h4>
                <p className="text-gray-300 text-sm">API endpoints, database optimization, server performance</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-400">Documentation</h4>
                <p className="text-gray-300 text-sm">Code documentation, user guides, API documentation</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-400">Testing</h4>
                <p className="text-gray-300 text-sm">Unit tests, integration tests, performance testing</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Code of Conduct</h3>
            <div className="space-y-2 text-gray-300">
              <p>• Be respectful and inclusive in all interactions</p>
              <p>• Follow the established coding standards and conventions</p>
              <p>• Write clear, descriptive commit messages</p>
              <p>• Test your code thoroughly before submitting</p>
              <p>• Provide detailed descriptions in pull requests</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Documentation Modal */}
      <Modal
        isOpen={activeModal === 'documentation'}
        onClose={closeModal}
        title="Developer Documentation"
      >
        <div className="text-white space-y-6">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">API Documentation</h3>
            <div className="space-y-4">
              <div className="border border-zinc-700 rounded p-4">
                <h4 className="font-semibold text-green-400 mb-2">GET /api/students/ranking</h4>
                <p className="text-gray-300 text-sm mb-2">Retrieve student rankings with optional filters</p>
                <div className="bg-black p-3 rounded text-xs font-mono">
                  <span className="text-blue-400">curl</span> <span className="text-yellow-400">-X GET</span> <span className="text-green-400">"https://api.ranknest.com/students/ranking?limit=10"</span>
                </div>
              </div>
              
              <div className="border border-zinc-700 rounded p-4">
                <h4 className="font-semibold text-blue-400 mb-2">POST /api/students/performance</h4>
                <p className="text-gray-300 text-sm mb-2">Submit student performance data</p>
                <div className="bg-black p-3 rounded text-xs font-mono">
                  <span className="text-blue-400">curl</span> <span className="text-yellow-400">-X POST</span> <span className="text-green-400">"https://api.ranknest.com/students/performance"</span>
                </div>
              </div>

              <div className="border border-zinc-700 rounded p-4">
                <h4 className="font-semibold text-purple-400 mb-2">PUT /api/students/{'{id}'}/profile</h4>
                <p className="text-gray-300 text-sm mb-2">Update student profile information</p>
                <div className="bg-black p-3 rounded text-xs font-mono">
                  <span className="text-blue-400">curl</span> <span className="text-yellow-400">-X PUT</span> <span className="text-green-400">"https://api.ranknest.com/students/123/profile"</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Integration Guide</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Authentication</h4>
                <p className="text-gray-300 text-sm mb-2">All API requests require authentication using Bearer tokens:</p>
                <div className="bg-black p-3 rounded text-xs font-mono">
                  <span className="text-gray-400">Authorization:</span> <span className="text-green-400">Bearer your_api_token_here</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Rate Limiting</h4>
                <p className="text-gray-300 text-sm">API requests are limited to 1000 requests per hour per API key.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response Format</h4>
                <p className="text-gray-300 text-sm mb-2">All responses are returned in JSON format:</p>
                <div className="bg-black p-3 rounded text-xs font-mono">
                  <pre className="text-green-400">{`{
  "status": "success",
  "data": {...},
  "timestamp": "2024-01-15T10:30:00Z"
}`}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">SDK Libraries</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-zinc-700 rounded p-4">
                <h4 className="font-semibold text-blue-400 mb-2">JavaScript/Node.js</h4>
                <div className="bg-black p-2 rounded text-xs font-mono">
                  <span className="text-yellow-400">npm install</span> <span className="text-green-400">@ranknest/sdk</span>
                </div>
              </div>
              
              <div className="border border-zinc-700 rounded p-4">
                <h4 className="font-semibold text-green-400 mb-2">Python</h4>
                <div className="bg-black p-2 rounded text-xs font-mono">
                  <span className="text-yellow-400">pip install</span> <span className="text-green-400">ranknest-python</span>
                </div>
              </div>
              
              <div className="border border-zinc-700 rounded p-4">
                <h4 className="font-semibold text-red-400 mb-2">Ruby</h4>
                <div className="bg-black p-2 rounded text-xs font-mono">
                  <span className="text-yellow-400">gem install</span> <span className="text-green-400">ranknest</span>
                </div>
              </div>
              
              <div className="border border-zinc-700 rounded p-4">
                <h4 className="font-semibold text-purple-400 mb-2">PHP</h4>
                <div className="bg-black p-2 rounded text-xs font-mono">
                  <span className="text-yellow-400">composer require</span> <span className="text-green-400">ranknest/php-sdk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-zinc-200 transition-colors flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>View Full Documentation</span>
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default About;