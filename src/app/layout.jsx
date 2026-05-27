export const metadata = {
  title: 'Elevation Lab — Elevate your mind. Create something real.',
  description: 'A creative productivity platform for the elevated lifestyle.',
  manifest: '/manifest.json',
  themeColor: '#020008',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#020008' }}>
        {children}
      </body>
    </html>
  );
}