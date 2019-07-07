import axios from 'axios';
import { auth } from './auth.service';

const { api } = require('../public');

async function get(url) {
  const { uid } = auth();
  try {
    const { data } = await axios.get(url, {
      params: {
        uid,
      },
    });

    return data;
  } catch (err) {
    throw err;
  }
}

export async function getUser() {
  return get(`${api}/getUser`);
}

export async function getPlaylists() {
  return get(`${api}/getPlaylists`);
}

export async function getTop() {
  return get(`${api}/getTop`);
}

export async function getRecs() {
  return get(`${api}/getRecs`);
}

export async function getPlaylistQuiz(answers) {
  const ansParams = {};
  Object.keys(answers).forEach((k) => {
    const ans = answers[k];
    ansParams[`d${k}`] = `${ans.id}|${ans.ansTp}`;
  });

  const { uid } = auth();
  try {
    const { data } = await axios.get(`${api}/playlistQuiz`, {
      params: {
        uid,
        ...ansParams,
      },
    });

    return data;
  } catch (err) {
    throw err;
  }
}

export async function addMusic(playlistId, musicUri) {
  const { uid } = auth();
  console.log('addMusic');
  try {
    const { data } = await axios.put(`${api}/addMusic`, {}, {
      params: {
        uid,
        playlistId,
        musicUri,
      },
    });
    return data;
  } catch (err) {
    throw err;
  }
}

export async function createPlaylist(playlistName, tracks) {
  const { uid } = auth();
  if (!tracks || !playlistName) return null;
  try {
    const { data } = await axios.post(`${api}/createPlaylist`, { tracks }, {
      params: {
        uid,
        playlistName,
      },
    });

    return data;
  } catch (err) {
    throw err;
  }
}
