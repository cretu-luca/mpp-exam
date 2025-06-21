"use client";

import { useState } from "react";
import { CandidateCard } from "~/app/_components/CandidateCard";
import { CandidateForm } from "~/app/_components/CandidateForm";
import { CandidatesChart } from "~/app/_components/CandidatesChart";
import { useCandidates } from "~/contexts/CandidatesContext";
import { type Candidate } from "~/types";

export default function CandidatesPage() {
  const { 
    candidates, 
    addCandidate, 
    updateCandidate, 
    deleteCandidate, 
    isGenerating, 
    startGeneration, 
    stopGeneration,
    loading
  } = useCandidates();
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  const handleAddCandidate = async (candidateData: Omit<Candidate, 'id'>) => {
    try {
      await addCandidate(candidateData);
      setShowForm(false);
    } catch (error) {
      alert('Failed to add candidate. Please try again.');
    }
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleUpdateCandidate = async (candidateData: Omit<Candidate, 'id'>) => {
    if (editingCandidate) {
      try {
        await updateCandidate(editingCandidate.id, candidateData);
        setEditingCandidate(null);
        setShowForm(false);
      } catch (error) {
        alert('Failed to update candidate. Please try again.');
      }
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteCandidate(id);
      } catch (error) {
        alert('Failed to delete candidate. Please try again.');
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCandidate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              Romanian Presidential Election Candidates 2024
            </h1>
            <p className="text-gray-600">
              Click on any candidate to view their detailed information
            </p>
          </div>
          <div className="flex gap-3 ml-4">
            <button
              onClick={isGenerating ? stopGeneration : startGeneration}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isGenerating 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isGenerating ? 'Stop Generation' : 'Start Generation'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Candidate
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <CandidatesChart />
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading candidates...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="relative group">
                <CandidateCard candidate={candidate} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditCandidate(candidate);
                    }}
                    className="bg-yellow-500 text-white p-1 rounded text-xs hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteCandidate(candidate.id);
                    }}
                    className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <CandidateForm
            candidate={editingCandidate}
            onSubmit={editingCandidate ? handleUpdateCandidate : handleAddCandidate}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
} 