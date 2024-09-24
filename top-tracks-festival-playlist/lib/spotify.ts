import axios from 'axios';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? '';
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET ?? '';

const getAccessToken = async (): Promise<string> => {
  if (!clientId || !clientSecret) {
    throw new Error('Client ID or Client Secret is missing. Please check your environment variables.');
  }

  try{
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch(error: any){
    // エラーの詳細をコンソールに出力
    if (error.response) {
      console.error('Error Response:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      console.error('No Response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to retrieve access token');
  }  
};

export default getAccessToken;
