import { type NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { z } from 'zod';

const loginSchema = z.object({
  cnp: z.string().min(13).max(13).regex(/^\d{13}$/, 'CNP must be exactly 13 digits'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const { cnp } = loginSchema.parse(body);

    // Find voter by CNP
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

    return NextResponse.json({
      success: true,
      voter: {
        cnp: voter.cnp,
        name: voter.name,
        hasVoted: voter.hasVoted || voter.votes.length > 0
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 