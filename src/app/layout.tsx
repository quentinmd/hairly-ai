import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hairly AI — Test Your Haircut Before the Barber",
  description: "AI-powered haircut simulator. Upload a selfie, choose a hairstyle, and see your new look in seconds. Try taper fade, curly, buzzcut, mullet, wolf cut and more.",
  keywords: ["AI haircut", "virtual hairstyle", "haircut simulator", "taper fade", "try hairstyle online"],
  openGraph: {
    title: "Hairly AI — AI Haircut Simulator",
    description: "See your new haircut before going to the barber. Powered by AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
