import type { Metadata } from "next";
import { DM_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export const metadata: Metadata = {
  title: "dhoklu — Janhvi's playful corner of the internet",
  description: "A portfolio of software, art, tiny experiments and creative gatherings by Janhvi, aka dhoklu.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${spaceGrotesk.variable} ${syne.variable} ${dmMono.variable}`}><body><AppProviders>{children}</AppProviders></body></html>;
}
