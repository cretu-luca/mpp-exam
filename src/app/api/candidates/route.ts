import { NextRequest, NextResponse } from 'next/server';
import { candidatesStore } from '~/lib/candidatesStore';
import { type Candidate } from '~/types';

// GET /api/candidates - Get all candidates
export async function GET() {
  try {
    const candidates = candidatesStore.getAllCandidates();
    return NextResponse.json(candidates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST /api/candidates - Create new candidate
export async function POST(request: NextRequest) {
  try {
    const candidateData: Omit<Candidate, 'id'> = await request.json();
    
    // Validate required fields
    if (!candidateData.name || !candidateData.party || !candidateData.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newCandidate = candidatesStore.addCandidate(candidateData);
    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
} 