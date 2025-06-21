"use client";

import { useState, useEffect } from "react";
import { candidatesData } from "~/data/candidates";
import { type Candidate } from "~/types";

interface SimulationResult {
  candidateId: string;
  candidateName: string;
  votes: number;
  percentage: number;
}

interface SecondRoundCandidate {
  id: string;
  name: string;
  image: string;
  party: string;
  votes: number;
  percentage: number;
}

// Gaussian random number generator using Box-Muller transform
function gaussianRandom(mean: number = 0, stdDev: number = 1): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return z * stdDev + mean;
}

export const ElectionSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [secondRoundCandidates, setSecondRoundCandidates] = useState<SecondRoundCandidate[]>([]);
  const [hasSimulated, setHasSimulated] = useState(false);

  useEffect(() => {
    // Check if there are saved results in localStorage
    const savedResults = localStorage.getItem('election-second-round');
    if (savedResults) {
      const parsed = JSON.parse(savedResults);
      setSecondRoundCandidates(parsed);
      setHasSimulated(true);
    }
  }, []);

  const simulateElection = () => {
    setIsSimulating(true);
    
    // Simulate with a delay for better UX
    setTimeout(() => {
      // Create candidate weights using Gaussian distribution
      // Some candidates are more favored than others
      const candidateWeights: { [key: string]: number } = {
        "1": gaussianRandom(0.8, 0.2), // Klaus Iohannis - slightly favored
        "2": gaussianRandom(0.9, 0.15), // Marcel Ciolacu - most favored
        "3": gaussianRandom(0.7, 0.25), // Elena Lasconi - moderately favored
        "4": gaussianRandom(0.6, 0.3), // George Simion - less favored
        "5": gaussianRandom(0.75, 0.2), // Nicolae Ciucă - moderately favored
        "6": gaussianRandom(0.4, 0.35), // Diana Șoșoacă - least favored
      };

      // Normalize weights to be positive
      Object.keys(candidateWeights).forEach(key => {
        candidateWeights[key] = Math.max(0.1, candidateWeights[key]!);
      });

      // Calculate total weight for normalization
      const totalWeight = Object.values(candidateWeights).reduce((sum, weight) => sum + weight, 0);

      // Simulate 100 voters
      const votes: { [key: string]: number } = {};
      candidatesData.forEach(candidate => {
        votes[candidate.id] = 0;
      });

      for (let i = 0; i < 100; i++) {
        const random = Math.random() * totalWeight;
        let accumulated = 0;
        
        for (const candidate of candidatesData) {
          accumulated += candidateWeights[candidate.id]!;
          if (random <= accumulated) {
            votes[candidate.id]++;
            break;
          }
        }
      }

      // Calculate results
      const simulationResults: SimulationResult[] = candidatesData.map(candidate => ({
        candidateId: candidate.id,
        candidateName: candidate.name,
        votes: votes[candidate.id]!,
        percentage: (votes[candidate.id]! / 100) * 100
      }));

      // Sort by votes descending
      simulationResults.sort((a, b) => b.votes - a.votes);

      // Get top 2 for second round
      const topTwo = simulationResults.slice(0, 2);
      
      const secondRound: SecondRoundCandidate[] = topTwo.map(result => {
        const candidate = candidatesData.find(c => c.id === result.candidateId)!;
        return {
          id: candidate.id,
          name: candidate.name,
          image: candidate.image,
          party: candidate.party,
          votes: result.votes,
          percentage: result.percentage
        };
      });

      // Save to localStorage
      localStorage.setItem('election-second-round', JSON.stringify(secondRound));

      setResults(simulationResults);
      setSecondRoundCandidates(secondRound);
      setHasSimulated(true);
      setIsSimulating(false);
    }, 2000);
  };

  const resetSimulation = () => {
    localStorage.removeItem('election-second-round');
    setResults([]);
    setSecondRoundCandidates([]);
    setHasSimulated(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🗳️ Election Simulation - First Round (Turul 1)
        </h2>
        
        {!hasSimulated ? (
          <button
            onClick={simulateElection}
            disabled={isSimulating}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-400 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            {isSimulating ? "Simulating..." : "Simulate"}
          </button>
        ) : (
          <div className="space-y-4">
            <button
              onClick={resetSimulation}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Reset & Simulate Again
            </button>
          </div>
        )}
      </div>

      {isSimulating && (
        <div className="text-center text-white mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mb-4"></div>
          <p>Counting votes from 100 citizens...</p>
        </div>
      )}

      {hasSimulated && secondRoundCandidates.length > 0 && (
        <div className="space-y-8">
          {/* Second Round Qualifiers */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              🏆 Qualified for Second Round (Turul 2)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {secondRoundCandidates.map((candidate, index) => (
                <div 
                  key={candidate.id}
                  className="border-2 border-yellow-400 rounded-lg p-6 text-center bg-gradient-to-br from-blue-50 to-yellow-50"
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-400">
                    <img 
                      src={candidate.image} 
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {index === 0 ? "🥇" : "🥈"} {candidate.name}
                  </h4>
                  
                  <p className="text-gray-600 text-sm mb-3">{candidate.party}</p>
                  
                  <div className="bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded-lg">
                    {candidate.votes} votes ({candidate.percentage.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Complete First Round Results
              </h3>
              
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div 
                    key={result.candidateId}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      index < 2 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'
                    }`}
                  >
                    <span className="font-semibold text-gray-900">
                      {index + 1}. {result.candidateName}
                    </span>
                    <span className={`font-bold ${index < 2 ? 'text-blue-900' : 'text-gray-600'}`}>
                      {result.votes} votes ({result.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 