import axios from "axios";

const clientId = process.env.SPOTIFY_CLIENT_ID ?? "";
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? "";

const getAccessToken = async (): Promise<string> => {
  if (!clientId || !clientSecret) {
    throw new Error(
      "Client ID or Client Secret is missing. Please check your environment variables."
    );
  }

  // Base64エンコードされたクライアントIDとクライアントシークレットを作成
  const basicAuthToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuthToken}`, // Basic 認証を使用
        },
      }
    );
    return response.data.access_token;
  } catch {
    // エラーの詳細をコンソールに出力
    throw new Error("Failed to retrieve access token");
  }
};

export default getAccessToken;
