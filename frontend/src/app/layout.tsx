import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "House Design Platform",
  description: "Civil Engineering and Structural Asset Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}