import axios from 'axios';
import { auth } from './auth.service';

const { api } = require('../public');

const cache = {
  top: null,
  user: null,
  rec: null,
  playlists: null,
};

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
  if (!cache.user) cache.user = await get(`${api}/getUser`);
  return cache.user;
}

export async function getPlaylists() {
  if (!cache.playlists) cache.playlists = await get(`${api}/getPlaylists`);
  return cache.playlists;
}

export async function getTop() {
  if (!cache.top) cache.top = await get(`${api}/getTop`);
  return cache.top;
}

export async function getRecs() {
  if (!cache.rec) cache.rec = await get(`${api}/getRecs`);
  return cache.rec;
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
  try {
    const { data } = await axios.put(`${api}/addMusic`, {}, {
      params: {
        uid,
        playlistId,
        musicUri,
      },
    });
    cache.playlists = null;
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

    cache.playlists = null;
    return data;
  } catch (err) {
    throw err;
  }
}

export async function youtubeLink(query) {
  try {
    const { data: url } = await axios.get(`${api}/youtubeLink`, {
      params: {
        query,
      },
    });

    return url;
  } catch (err) {
    throw err;
  }
}
