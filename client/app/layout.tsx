import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],   
  display: 'swap',  // Usa la strategia 'swap' per evitare FOUT
  variable: '--font-roboto',   
});

export const metadata: Metadata = {
  title: "Auto Shop",
  description: "Progetto Test per corso Cyber-Security",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
