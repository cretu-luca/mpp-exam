"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type ReactNode } from 'react';
import { type Voter } from '~/types';

interface VotingContextType {
  voter: Voter | null;
  login: (cnp: string) => Promise<boolean>;
  register: (cnp: string, name: string) => Promise<boolean>;
  vote: (candidateId: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

export const VotingProvider = ({ children }: { children: ReactNode }) => {
  const [voter, setVoter] = useState<Voter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load voter from localStorage on mount
  useEffect(() => {
    const savedVoter = localStorage.getItem('voter');
    if (savedVoter) {
      try {
        setVoter(JSON.parse(savedVoter) as Voter);
      } catch {
        localStorage.removeItem('voter');
      }
    }
  }, []);

  const login = async (cnp: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/voters/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnp }),
      });

      const data = await response.json() as { success?: boolean; voter?: Voter; error?: string };

      if (response.ok && data.success && data.voter) {
        setVoter(data.voter);
        localStorage.setItem('voter', JSON.stringify(data.voter));
        return true;
      } else {
        setError(data.error ?? 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (cnp: string, name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/voters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnp, name }),
      });

      const data = await response.json() as { success?: boolean; voter?: Voter; error?: string };

      if (response.ok && data.success && data.voter) {
        setVoter(data.voter);
        localStorage.setItem('voter', JSON.stringify(data.voter));
        return true;
      } else {
        setError(data.error ?? 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const vote = async (candidateId: string): Promise<boolean> => {
    if (!voter) {
      setError('You must be logged in to vote');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnp: voter.cnp, candidateId }),
      });

      const data = await response.json() as { success?: boolean; error?: string };

      if (response.ok && data.success) {
        // Update voter state to reflect they have voted
        const updatedVoter = { ...voter, hasVoted: true };
        setVoter(updatedVoter);
        localStorage.setItem('voter', JSON.stringify(updatedVoter));
        return true;
      } else {
        setError(data.error ?? 'Voting failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setVoter(null);
    setError(null);
    localStorage.removeItem('voter');
  };

  return (
    <VotingContext.Provider value={{
      voter,
      login,
      register,
      vote,
      logout,
      error,
      loading,
    }}>
      {children}
    </VotingContext.Provider>
  );
}; 