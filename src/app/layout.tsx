import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { User, Settings } from "lucide-react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STOCKAI",
  description: "Minimalist dark mode stock analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-[#0a0a0a] !bg-[#0a0a0a] text-zinc-100 flex flex-col font-sans`}
      >
        <header className="border-b border-white/10 p-4 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
               <div className="font-bold text-xl tracking-tight flex items-center gap-1 text-white">
                 STOCK<span className="text-emerald-500">AI</span>
               </div>
               <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-300">
                 <a href="#" className="hover:text-white transition-colors">Market</a>
                 <a href="#" className="hover:text-white transition-colors">Analytics</a>
                 <a href="#" className="hover:text-white transition-colors">Portfolio</a>
                 <a href="#" className="hover:text-white transition-colors">Learn</a>
               </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="hidden sm:block text-xs font-semibold px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors text-zinc-200">
                Upgrade Plan
              </button>
              <button className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-white/10 hover:border-white/30 transition-colors text-zinc-200">
                JD
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
