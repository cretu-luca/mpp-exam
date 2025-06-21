import { type Candidate } from '~/types';
import { candidatesData } from '~/data/candidates';

// Server-side candidates store
class CandidatesStore {
  private candidates: Candidate[] = [...candidatesData];

  getAllCandidates(): Candidate[] {
    return [...this.candidates];
  }

  getCandidateById(id: string): Candidate | undefined {
    return this.candidates.find(c => c.id === id);
  }

  addCandidate(candidateData: Omit<Candidate, 'id'>): Candidate {
    const existingIds = this.candidates.map(c => parseInt(c.id)).filter(id => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newId = (maxId + 1).toString();

    const newCandidate: Candidate = {
      ...candidateData,
      id: newId,
    };

    this.candidates.push(newCandidate);
    return newCandidate;
  }

  updateCandidate(id: string, candidateData: Omit<Candidate, 'id'>): Candidate | null {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.candidates[index] = { ...candidateData, id };
    return this.candidates[index]!;
  }

  deleteCandidate(id: string): boolean {
    const index = this.candidates.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.candidates.splice(index, 1);
    return true;
  }
}

// Export singleton instance
export const candidatesStore = new CandidatesStore(); 