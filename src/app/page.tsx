import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Romanian <span className="text-yellow-300">Elections</span> 2024
        </h1>
        
        <p className="text-xl text-center max-w-2xl">
          Explore the candidates running for President of Romania in the 2024 elections. 
          Learn about their backgrounds, political parties, and visions for the country.
        </p>
        
        <Link
          href="/candidates"
          className="rounded-lg bg-yellow-400 px-8 py-4 text-lg font-semibold text-blue-900 no-underline transition hover:bg-yellow-300"
        >
          View All Candidates
        </Link>
      </div>
    </main>
  );
}
