import type { Metadata } from "next";
import "./globals.css";
import { Roboto, Open_Sans } from 'next/font/google';


const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],   
  display: 'swap',  //  per evitare FOUT
  variable: '--font-roboto',   
});
const open_sans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],   
  display: 'swap',  //  per evitare FOUT
  variable: '--font-open_sans',   
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
        className={`${roboto.variable} ${open_sans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
