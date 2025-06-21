export interface Candidate {
  id: string;
  name: string;
  image: string;
  party: string;
  description: string;
}

export interface Voter {
  cnp: string;
  name: string;
  hasVoted: boolean;
  createdAt?: Date;
}

export interface Vote {
  id: string;
  voterCnp: string;
  candidateId: string;
  createdAt: Date;
}

export interface VoteStatistics {
  votes: Array<{
    candidateId: string;
    count: number;
  }>;
  totalVotes: number;
  totalVoters: number;
  turnout: number;
} 