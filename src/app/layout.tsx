import type { Metadata } from "next";
import { Playfair_Display, Jost, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthContext";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "City of Mobile — Business License Portal",
  description: "Apply for your City of Mobile business license online — fast, secure, and paperless.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", playfair.variable, jost.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
