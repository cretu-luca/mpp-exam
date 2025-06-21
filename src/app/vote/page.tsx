"use client";

import { useVoting } from '~/contexts/VotingContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import VoterAuth from '~/app/_components/VoterAuth';

export default function VotePage() {
  const { voter } = useVoting();
  const router = useRouter();

  useEffect(() => {
    if (voter) {
      // Redirect to candidates page if logged in
      router.push('/candidates');
    }
  }, [voter, router]);

  if (voter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting to candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Romanian Elections 2024
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          Login or register to cast your vote
        </p>
        <VoterAuth />
      </div>
    </div>
  );
} 