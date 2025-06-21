"use client";

import { useState } from 'react';
import { useVoting } from '~/contexts/VotingContext';

export default function VoterAuth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [cnp, setCnp] = useState('');
  const [name, setName] = useState('');
  const { login, register, error, loading } = useVoting();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      await login(cnp);
    } else {
      await register(cnp, name);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex mb-6">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 px-4 rounded-l-lg transition-colors ${
            mode === 'login'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-2 px-4 rounded-r-lg transition-colors ${
            mode === 'register'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cnp" className="block text-sm font-medium text-gray-700">
            CNP (13 digits)
          </label>
          <input
            type="text"
            id="cnp"
            value={cnp}
            onChange={(e) => setCnp(e.target.value)}
            maxLength={13}
            pattern="[0-9]{13}"
            placeholder="Enter your CNP"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-600">
        {mode === 'login' 
          ? "Don't have an account? Click Register above."
          : "Already have an account? Click Login above."
        }
      </p>
    </div>
  );
} 