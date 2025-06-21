import Image from "next/image";
import Link from "next/link";
import { type Candidate } from "~/types";

interface CandidateCardProps {
  candidate: Candidate;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  return (
    <Link 
      href={`/candidates/${candidate.id}`}
      className="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
    >
      <div className="aspect-square relative overflow-hidden">
        <Image 
          src={candidate.image} 
          alt={candidate.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
        <p className="text-gray-600 text-sm mt-1">{candidate.party}</p>
      </div>
    </Link>
  );
}; 