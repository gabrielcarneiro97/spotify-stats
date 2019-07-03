import cookies from 'cookiesjs';
import axios from 'axios';

const { spotify } = require('../private');
const { api } = require('../public');

export function spotifyAuthLink() {
  const base = 'https://accounts.spotify.com/authorize?';
  const clientId = `client_id=${spotify.clientId}`;
  const responseType = '&response_type=code';
  const redirectUri = `&redirect_uri=${spotify.encodedRedirectUri}`;
  const scope = `&scope=${spotify.encodedScopes}`;

  return base + clientId + responseType + redirectUri + scope;
}

export function auth() {
  return {
    uid: cookies('uidStatsfy'),
    signOut: (history) => {
      cookies({ uidStatsfy: null });
      if (history) history.push('/login');
    },
  };
}

export function spotifyRedirect() {
  window.location.href = spotifyAuthLink();
}

export async function login(code) {
  try {
    const { data } = await axios.get(`${api}/spotifyLogin`, {
      params: {
        code,
      },
    });

    cookies({ uidStatsfy: data.id });

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
