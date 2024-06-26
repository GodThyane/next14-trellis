import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`, // My board | Trellis
   },
   description: siteConfig.description,
   icons: [
      {
         url: '/logo.png',
         href: '/logo.png',
      },
   ],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="es">
         <body className={inter.className}>{children}</body>
      </html>
   );
}
