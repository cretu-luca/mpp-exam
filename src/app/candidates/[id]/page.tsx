"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import { useCandidates } from "~/contexts/CandidatesContext";

export default function CandidateDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const { getCandidateById, loading } = useCandidates();
  const candidate = getCandidateById(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/candidates" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium"
        >
          ← Back to all candidates
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Circular image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-gray-200">
                  <Image
                    src={candidate.image}
                    alt={candidate.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                  />
                </div>
              </div>
              
              {/* Candidate information */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">{candidate.name}</h1>
                <h2 className="text-xl text-blue-600 mb-6 font-medium">{candidate.party}</h2>
                
                <h3 className="text-lg font-semibold mb-3 text-gray-900">About the Candidate</h3>
                <p className="text-gray-700 leading-relaxed">{candidate.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 