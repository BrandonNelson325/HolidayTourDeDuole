import React, { useState } from 'react';
import { LogIn, X } from 'lucide-react';
import { ADMIN_CODE } from '../config/auth';

interface AdminLoginProps {
  isAuthenticated: boolean;
  onLogin: (isAuth: boolean) => void;
}

export function AdminLogin({ isAuthenticated, onLogin }: AdminLoginProps) {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      onLogin(true);
      setShowModal(false);
      setError('');
    } else {
      setError('Invalid code');
    }
    setCode('');
  };

  const handleLogout = () => {
    onLogin(false);
  };

  return (
    <>
      <button
        onClick={isAuthenticated ? handleLogout : () => setShowModal(true)}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
          isAuthenticated ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        <LogIn className="h-5 w-5 mr-2" />
        {isAuthenticated ? 'Logout' : 'Admin Login'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Admin Login</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Enter Admin Code
                </label>
                <input
                  type="password"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}