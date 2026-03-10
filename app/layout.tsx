import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ghada Alhajajji | Cybersecurity Portfolio",
  description:
    "Cybersecurity analyst and AI security researcher focused on blue teaming, SOC analysis, and secure AI systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceGrotesk.className} bg-black antialiased`}
      >
        {/* Fixed deep space / cyber background – covers full viewport, stays behind all content */}
        <div
          className="fixed inset-0 z-[-1] pointer-events-none"
          aria-hidden="true"
        >
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage:
                "linear-gradient(to right, #8080801a 1px, transparent 1px), linear-gradient(to bottom, #8080801a 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Center purple glow */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(88, 28, 135, 0.18) 0%, rgba(88, 28, 135, 0.06) 40%, transparent 70%)",
            }}
          />
          {/* Cosmic dust / soft orbs */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 120% 100% at 20% 20%, rgba(147, 51, 234, 0.04) 0%, transparent 50%), radial-gradient(ellipse 80% 120% at 80% 30%, rgba(126, 34, 206, 0.05) 0%, transparent 50%), radial-gradient(ellipse 100% 80% at 60% 80%, rgba(88, 28, 135, 0.04) 0%, transparent 50%), radial-gradient(ellipse 60% 100% at 10% 60%, rgba(147, 51, 234, 0.03) 0%, transparent 45%), radial-gradient(ellipse 80% 60% at 90% 85%, rgba(126, 34, 206, 0.04) 0%, transparent 45%)",
            }}
          />
          {/* Stars / specks */}
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3Ccircle cx='30' cy='40' r='0.5' fill='%23fff' opacity='0.15'/%3E%3Ccircle cx='120' cy='80' r='0.5' fill='%23fff' opacity='0.12'/%3E%3Ccircle cx='200' cy='30' r='0.5' fill='%23fff' opacity='0.1'/%3E%3Ccircle cx='80' cy='180' r='0.5' fill='%23fff' opacity='0.14'/%3E%3Ccircle cx='180' cy='200' r='0.5' fill='%23fff' opacity='0.11'/%3E%3Ccircle cx='50' cy='220' r='0.5' fill='%23fff' opacity='0.08'/%3E%3Ccircle cx='220' cy='120' r='0.5' fill='%23fff' opacity='0.13'/%3E%3C/svg%3E")`,
              backgroundSize: "256px 256px",
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
