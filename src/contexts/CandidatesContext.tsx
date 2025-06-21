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
  startGeneration: () => void;
  stopGeneration: () => void;
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

  // Initialize Server-Sent Events connection
  useEffect(() => {
    const eventSource = new EventSource('/api/candidates/events');

    eventSource.onopen = () => {
      console.log('Connected to Server-Sent Events');
      setLoading(false);
    };

    eventSource.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data) as { type: string; data: Candidate[] };
        
        if (eventData.type === 'candidates-updated') {
          setCandidates(eventData.data);
          setLoading(false);
        }
      } catch (error: unknown) {
        console.error('Error parsing SSE message:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      setLoading(false);
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  // Load initial data and generation status
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [candidatesResponse, statusResponse] = await Promise.all([
          fetch('/api/candidates'),
          fetch('/api/candidates/generate')
        ]);

        if (candidatesResponse.ok) {
          const data = await candidatesResponse.json() as Candidate[];
          setCandidates(data);
        }

        if (statusResponse.ok) {
          const statusData = await statusResponse.json() as { isGenerating: boolean };
          setIsGenerating(statusData.isGenerating);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };

    void fetchInitialData();
  }, []);

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
      // SSE will handle the update automatically
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
      // SSE will handle the update automatically
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
      // SSE will handle the update automatically
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  };

  const getCandidateById = (id: string) => {
    return candidates.find(candidate => candidate.id === id);
  };

  const startGeneration = () => {
    void (async () => {
      try {
        const response = await fetch('/api/candidates/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'start' }),
        });

        if (response.ok) {
          const data = await response.json() as { isGenerating: boolean };
          setIsGenerating(data.isGenerating);
        }
      } catch (error) {
        console.error('Error starting generation:', error);
      }
    })();
  };

  const stopGeneration = () => {
    void (async () => {
      try {
        const response = await fetch('/api/candidates/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'stop' }),
        });

        if (response.ok) {
          const data = await response.json() as { isGenerating: boolean };
          setIsGenerating(data.isGenerating);
        }
      } catch (error) {
        console.error('Error stopping generation:', error);
      }
    })();
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