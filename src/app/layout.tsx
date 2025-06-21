import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { CandidatesProvider } from "~/contexts/CandidatesContext";

export const metadata: Metadata = {
  title: "Romanian Elections 2024",
  description: "Presidential election candidates for Romania 2024",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <CandidatesProvider>
            {children}
          </CandidatesProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
