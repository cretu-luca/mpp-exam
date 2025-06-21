export interface FakeNews {
  id: string;
  headline: string;
  content: string;
  candidateName: string;
  timestamp: string;
}

export const fakeNewsData: FakeNews[] = [
  {
    id: "1",
    headline: "Klaus Iohannis Spotted Learning Traditional Romanian Dance",
    content: "Sources claim the current president was seen taking folk dance lessons in preparation for the upcoming campaign trail. 'He wants to connect with his roots,' says anonymous insider.",
    candidateName: "Klaus Iohannis",
    timestamp: "2 hours ago"
  },
  {
    id: "2", 
    headline: "Marcel Ciolacu Promises Free Pizza for Every Romanian",
    content: "In a surprising campaign promise, the PSD leader announced plans to establish a national pizza program. 'Every Romanian deserves happiness, and pizza brings happiness,' he reportedly said.",
    candidateName: "Marcel Ciolacu",
    timestamp: "5 hours ago"
  },
  {
    id: "3",
    headline: "Elena Lasconi's Secret Hobby: Competitive Knitting",
    content: "The USR candidate has allegedly been dominating local knitting competitions under a pseudonym. 'She can knit a sweater faster than most people can tweet,' claims a witness.",
    candidateName: "Elena Lasconi", 
    timestamp: "1 day ago"
  },
  {
    id: "4",
    headline: "George Simion Adopts 50 Stray Cats, Names Them All 'România'",
    content: "The AUR leader has reportedly turned his backyard into a cat sanctuary. Neighbors confirm unusual amounts of cat food deliveries and patriotic meowing at dawn.",
    candidateName: "George Simion",
    timestamp: "3 hours ago"
  },
  {
    id: "5",
    headline: "Nicolae Ciucă Challenges Opponents to Arm Wrestling Contest",
    content: "The former general suggests settling political debates through physical strength tests. 'Democracy is about strength, and I've been doing push-ups since 1970,' he allegedly stated.",
    candidateName: "Nicolae Ciucă",
    timestamp: "6 hours ago"
  },
  {
    id: "6",
    headline: "Diana Șoșoacă Opens Conspiracy Theory Theme Park",
    content: "The SOS România leader has reportedly invested in an amusement park where every ride is based on a different conspiracy theory. The tunnel of love is said to reveal 'hidden truths about politics.'",
    candidateName: "Diana Șoșoacă",
    timestamp: "4 hours ago"
  }
]; 