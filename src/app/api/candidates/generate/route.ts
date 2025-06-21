import { type NextRequest, NextResponse } from 'next/server';
import { candidatesStore } from '~/lib/candidatesStore';

// Random candidate generation
const firstNames = [
  'Alexandru', 'Maria', 'Ion', 'Ana', 'Mihai', 'Elena', 'Gheorghe', 'Ioana',
  'Vasile', 'Carmen', 'Nicolae', 'Cristina', 'Stefan', 'Andreea', 'Florin',
  'Diana', 'Marian', 'Laura', 'Adrian', 'Monica', 'Daniel', 'Oana'
];

const lastNames = [
  'Popescu', 'Ionescu', 'Georgescu', 'Stoica', 'Constantinescu', 'Munteanu',
  'Stanciu', 'Florea', 'Dinu', 'Nedelcu', 'Petrescu', 'Andrei', 'Manole',
  'Bogdan', 'Preda', 'Moldovan', 'Popa', 'Radu', 'Cojocaru', 'Dumitrescu'
];

const descriptions = [
  'A dedicated politician with years of experience in public service.',
  'Former business leader turned political activist.',
  'Long-time advocate for social justice and economic reform.',
  'Career diplomat with extensive international experience.',
  'Former mayor known for urban development initiatives.',
  'Academic turned politician with expertise in education policy.',
  'Military veteran with a strong focus on national security.',
  'Environmental activist committed to sustainable development.',
];

function generateRandomCandidate() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]!;
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]!;
  const name = `${firstName} ${lastName}`;
  
  const currentCandidates = candidatesStore.getAllCandidates();
  const existingParties = [...new Set(currentCandidates.map(c => c.party))];
  const party = existingParties[Math.floor(Math.random() * existingParties.length)] ?? 'Independent';
  
  const description = descriptions[Math.floor(Math.random() * descriptions.length)]!;
  
  const initials = name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  const image = `https://placehold.co/600x400/000000/FFFFFF.png?text=${initials}`;
  
  return { name, party, description, image };
}

// Store generation state
let isGenerating = false;
let generationInterval: NodeJS.Timeout | null = null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { action: 'start' | 'stop' | 'generate-one' };
    
    if (body.action === 'start') {
      if (!isGenerating) {
        isGenerating = true;
        generationInterval = setInterval(() => {
          const randomCandidate = generateRandomCandidate();
          candidatesStore.addCandidate(randomCandidate);
        }, 1000);
      }
      return NextResponse.json({ success: true, isGenerating: true });
    }
    
    if (body.action === 'stop') {
      if (generationInterval) {
        clearInterval(generationInterval);
        generationInterval = null;
      }
      isGenerating = false;
      return NextResponse.json({ success: true, isGenerating: false });
    }
    
    if (body.action === 'generate-one') {
      const randomCandidate = generateRandomCandidate();
      const newCandidate = candidatesStore.addCandidate(randomCandidate);
      return NextResponse.json({ success: true, candidate: newCandidate });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ isGenerating });
} 