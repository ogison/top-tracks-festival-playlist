import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "PLAYLISTER X",
    default: "PLAYLISTER X",
  },
  description: "Spotify APIを使用してプレイリスト作成を行います。",
  metadataBase: new URL("https://playlister-x.vercel.app/"),
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
