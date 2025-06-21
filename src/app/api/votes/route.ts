import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { z } from 'zod';

const voteSchema = z.object({
  cnp: z.string().min(13).max(13).regex(/^\d{13}$/, 'CNP must be exactly 13 digits'),
  candidateId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const { cnp, candidateId } = voteSchema.parse(body);

    // Check if voter exists and hasn't voted yet
    const voter = await db.voter.findUnique({
      where: { cnp },
      include: {
        votes: true
      }
    });

    if (!voter) {
      return NextResponse.json(
        { error: 'Voter not found. Please register first.' },
        { status: 404 }
      );
    }

    if (voter.hasVoted || voter.votes.length > 0) {
      return NextResponse.json(
        { error: 'You have already voted.' },
        { status: 400 }
      );
    }

    // Create the vote and update voter status in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create the vote
      const vote = await tx.vote.create({
        data: {
          voterCnp: cnp,
          candidateId: candidateId,
        },
      });

      // Update voter to mark as voted
      await tx.voter.update({
        where: { cnp },
        data: { hasVoted: true },
      });

      return vote;
    });

    return NextResponse.json({
      success: true,
      message: 'Vote cast successfully',
      vote: {
        id: result.id,
        candidateId: result.candidateId,
        createdAt: result.createdAt
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Error casting vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get voting statistics
export async function GET() {
  try {
    const votes = await db.vote.groupBy({
      by: ['candidateId'],
      _count: {
        candidateId: true
      }
    });

    const totalVotes = await db.vote.count();
    const totalVoters = await db.voter.count();

    return NextResponse.json({
      votes: votes.map(vote => ({
        candidateId: vote.candidateId,
        count: vote._count.candidateId
      })),
      totalVotes,
      totalVoters,
      turnout: totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0
    });
  } catch (error) {
    console.error('Error fetching vote statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 