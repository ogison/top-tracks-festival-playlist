import './globals.css';

export const metadata = {
  title: 'Spotify Top Tracks',
  description: 'Get the top tracks of your favorite artists from Spotify',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
