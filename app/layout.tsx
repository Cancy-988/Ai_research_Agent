import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Investment Research Agent | Institutional-Grade Equity Analysis',
  description: 'Conduct thorough company financial research, sentiment scanning, and SWOT analysis using Gemini 2.5 Flash and LangGraph.',
  keywords: ['Investment', 'AI Agent', 'Research', 'SWOT', 'Financial Analysis', 'Stock Analysis', 'Gemini'],
  authors: [{ name: 'Investment AI Engineering Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-main text-slate-100 selection:bg-brand-emerald/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
