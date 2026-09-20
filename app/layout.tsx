import type { Metadata } from "next";
import { Instrument_Sans, Young_Serif } from "next/font/google";
import DemoPill from "@/components/chrome/DemoPill";
import StoreHydration from "@/components/chrome/StoreHydration";
import Toaster from "@/components/ui/Toast";
import "./globals.css";

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  weight: "400",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heartworks",
  description:
    "Volunteer roles matched to what you want to learn and what your neighborhood needs done.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${youngSerif.variable} ${instrumentSans.variable}`}>
      <body className="min-h-screen antialiased">
        <StoreHydration />
        {children}
        <DemoPill />
        <Toaster />
      </body>
    </html>
  );
}
