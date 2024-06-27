import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";

import "./globals.css";

const kanit = Kanit({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Insulation",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={(inter.className, kanit.className)}>{children}</body>
    </html>
  );
}
