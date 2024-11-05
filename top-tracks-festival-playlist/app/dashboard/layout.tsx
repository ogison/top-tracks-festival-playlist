import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "PLAYLISTER X",
    default: "PLAYLISTER X",
  },
  description: "Spotify APIを使用してプレイリスト作成を行います。",
  metadataBase: new URL("https://playlister-x.vercel.app/"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
