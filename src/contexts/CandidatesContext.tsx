"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type ReactNode } from 'react';
import { type Candidate } from '~/types';

interface CandidatesContextType {
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, 'id'>) => Promise<void>;
  updateCandidate: (id: string, candidate: Omit<Candidate, 'id'>) => Promise<void>;
  deleteCandidate: (id: string) => Promise<void>;
  getCandidateById: (id: string) => Candidate | undefined;
  isGenerating: boolean;
  startGeneration: () => Promise<void>;
  stopGeneration: () => Promise<void>;
  loading: boolean;
}

const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined);

export const useCandidates = () => {
  const context = useContext(CandidatesContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidatesProvider');
  }
  return context;
};

export const CandidatesProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize polling for real-time updates
  useEffect(() => {
    // Load initial data
    fetchCandidates();
    fetchGenerationStatus();

    // Set up polling for real-time updates
    const pollInterval = setInterval(() => {
      fetchCandidates();
      fetchGenerationStatus();
    }, 1500); // Poll every 1.5 seconds for real-time feel

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setLoading(false);
    }
  };

  const fetchGenerationStatus = async () => {
    try {
      const response = await fetch('/api/candidates/generate');
      if (response.ok) {
        const data = await response.json();
        setIsGenerating(data.isGenerating);
      }
    } catch (error) {
      console.error('Error fetching generation status:', error);
    }
  };

  const addCandidate = async (candidateData: Omit<Candidate, 'id'>) => {
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateData),
      });

      if (!response.ok) {
        throw new Error('Failed to add candidate');
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  };

  const updateCandidate = async (id: string, candidateData: Omit<Candidate, 'id'>) => {
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  };

  const deleteCandidate = async (id: string) => {
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete candidate');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  };

  const getCandidateById = (id: string) => {
    return candidates.find(candidate => candidate.id === id);
  };

  const startGeneration = async () => {
    try {
      const response = await fetch('/api/candidates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsGenerating(data.isGenerating);
      }
    } catch (error) {
      console.error('Error starting generation:', error);
    }
  };

  const stopGeneration = async () => {
    try {
      const response = await fetch('/api/candidates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stop' }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsGenerating(data.isGenerating);
      }
    } catch (error) {
      console.error('Error stopping generation:', error);
    }
  };

  return (
    <CandidatesContext.Provider value={{
      candidates,
      addCandidate,
      updateCandidate,
      deleteCandidate,
      getCandidateById,
      isGenerating,
      startGeneration,
      stopGeneration,
      loading,
    }}>
      {children}
    </CandidatesContext.Provider>
  );
}; 