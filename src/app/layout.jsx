export const metadata = {
  title: 'Elevation Club — Portal to a New World',
  description: 'A creative productivity platform for the elevated lifestyle.',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  );
}
