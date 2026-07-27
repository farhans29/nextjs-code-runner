import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Runner Learning Lab",
  description: "A beginner-friendly playground for learning code through instant output.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
