import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Spotify Login</h1>
      <p>Login with your Spotify account to continue</p>
      <Link href="/api/login">
        <Button>Login with Spotify</Button>
      </Link>
    </div>
  );
}
