import { type NextRequest, NextResponse } from 'next/server';
import { candidatesStore } from '~/lib/candidatesStore';
import { type Candidate } from '~/types';

// GET /api/candidates/[id] - Get single candidate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidate = candidatesStore.getCandidateById(id);
    
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    
    return NextResponse.json(candidate);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 });
  }
}

// PUT /api/candidates/[id] - Update candidate
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidateData = await request.json() as Omit<Candidate, 'id'>;
    
    // Validate required fields
    if (!candidateData.name || !candidateData.party || !candidateData.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedCandidate = candidatesStore.updateCandidate(id, candidateData);
    
    if (!updatedCandidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedCandidate);
  } catch {
    return NextResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
  }
}

// DELETE /api/candidates/[id] - Delete candidate
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = candidatesStore.deleteCandidate(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Candidate deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
} 