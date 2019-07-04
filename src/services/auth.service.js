import cookies from 'cookiesjs';
import axios from 'axios';

const { api } = require('../public');

export async function spotifyAuthLink() {
  const { data } = await axios.get(`${api}/spotifyLink`);
  return data;
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

export async function spotifyRedirect() {
  const link = await spotifyAuthLink();
  console.log(link);
  window.location.href = link;
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
