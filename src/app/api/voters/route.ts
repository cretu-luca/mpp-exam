import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { z } from 'zod';

const registerVoterSchema = z.object({
  cnp: z.string().min(13).max(13).regex(/^\d{13}$/, 'CNP must be exactly 13 digits'),
  name: z.string().min(2).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const { cnp, name } = registerVoterSchema.parse(body);

    // Check if voter already exists
    const existingVoter = await db.voter.findUnique({
      where: { cnp }
    });

    if (existingVoter) {
      return NextResponse.json(
        { error: 'Voter with this CNP already registered' },
        { status: 400 }
      );
    }

    // Create new voter
    const voter = await db.voter.create({
      data: {
        cnp,
        name,
      },
    });

    return NextResponse.json({
      success: true,
      voter: {
        cnp: voter.cnp,
        name: voter.name,
        hasVoted: voter.hasVoted
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Error creating voter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 