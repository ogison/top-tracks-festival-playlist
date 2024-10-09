import React from "react";
import Image from "next/image";

const SpotifyLogo = () => {
  return (
    <div className="text-right">
      <a
        href="https://www.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/images/Spotify_Full_Logo_RGB_Green.png"
          alt="Spotify Logo"
          width={172}
          height={47}
        />
      </a>
    </div>
  );
};

export default SpotifyLogo;
