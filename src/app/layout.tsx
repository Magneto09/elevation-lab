import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Elevation Lab — Elevate your mind. Create something real.',
  description: 'A creative productivity platform for the elevated lifestyle.',
  manifest: '/manifest.json',
  themeColor: '#020008',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#020008' }}>
        {children}
      </body>
    </html>
  );
}
