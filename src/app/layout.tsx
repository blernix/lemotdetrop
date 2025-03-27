// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './compoments/layout/Header';
import Footer from './compoments/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Le Mot De Trop',
  description: 'Blog & Mangas auto-édités',
  icons: {
    icon: '/icons/iconapp.png',
    apple: '/icons/iconapp.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className} style={{ backgroundColor: '#0d0d0d' }}>
        <Header />
        <main style={{ minHeight: '80vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}