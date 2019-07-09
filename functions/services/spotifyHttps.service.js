const axios = require('axios');
const qs = require('querystring');

const { spotify } = require('../private');

const {
  extractArtistData,
  extractTrackData,
  extractPlaylistData,
  extractSeeds,
} = require('./dataFilter.service');

async function token(type, code) {
  const grantType = type === 'code' ? 'authorization_code' : type;

  const url = 'https://accounts.spotify.com/api/token';

  const queryData = qs.stringify({
    grant_type: grantType,
    [type]: code,
    redirect_uri: spotify.redirectUri,
  });

  try {
    const axiosRes = await axios.post(url, queryData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${spotify.clientBase64}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
    return {
      ...axiosRes.data,
      date: new Date(new Date().getTime() + 3600000).toISOString(),
    };
  } catch (err) {
    throw err;
  }
}

async function spotifyGet(url, { access_token: at }, params) {
  try {
    const axiosRes = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${at}`,
      },
      params,
    });
    return axiosRes.data;
  } catch (err) {
    throw err;
  }
}

async function spotifyPost(url, { access_token: at }, params, data) {
  try {
    const axiosRes = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${at}`,
      },
      params,
    });
    return axiosRes.data;
  } catch (err) {
    throw err;
  }
}

async function spotifyPut(url, { access_token: at }, params, data) {
  try {
    const axiosRes = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${at}`,
      },
      params,
    });
    return axiosRes;
  } catch (err) {
    throw err;
  }
}

async function getApiUser(tokens) {
  try {
    const user = await spotifyGet('https://api.spotify.com/v1/me', tokens);
    return user;
  } catch (err) {
    throw err;
  }
}

async function getTop(tokens, type, timeRange) {
  return spotifyGet(`https://api.spotify.com/v1/me/top/${type}`, tokens, { time_range: timeRange });
}

async function getApiTopArtists(tokens) {
  try {
    const allArtists = {};
    const [long, medium, short] = await Promise.all([
      getTop(tokens, 'artists', 'long_term'),
      getTop(tokens, 'artists', 'medium_term'),
      getTop(tokens, 'artists', 'short_term'),
    ]);
    const extractFromItems = (items, time) => items.forEach((a, i) => {
      const artist = allArtists[a.id] || extractArtistData(a);
      artist.pos[time] = i + 1;
      allArtists[artist.id] = artist;
    });

    extractFromItems(long.items, 'long');
    extractFromItems(medium.items, 'medium');
    extractFromItems(short.items, 'short');

    return allArtists;
  } catch (err) {
    throw err;
  }
}

async function getApiTopTracks(tokens) {
  try {
    const allTracks = {};
    const [long, medium, short] = await Promise.all([
      getTop(tokens, 'tracks', 'long_term'),
      getTop(tokens, 'tracks', 'medium_term'),
      getTop(tokens, 'tracks', 'short_term'),
    ]);

    const extractFromItems = (items, time) => items.forEach((t, i) => {
      const track = allTracks[t.id] || extractTrackData(t);
      track.pos[time] = i + 1;
      allTracks[track.id] = track;
    });

    extractFromItems(long.items, 'long');
    extractFromItems(medium.items, 'medium');
    extractFromItems(short.items, 'short');

    return allTracks;
  } catch (err) {
    throw err;
  }
}

async function getAllPlaylists(uid, tokens) {
  return spotifyGet(`https://api.spotify.com/v1/users/${uid}/playlists`, tokens);
}

async function getApiPlaylists(uid, tokens) {
  try {
    const { items } = await getAllPlaylists(uid, tokens);
    const playlists = items.map(p => extractPlaylistData(p, uid));

    return playlists;
  } catch (err) {
    throw err;
  }
}

async function addMusicsToPlaylist(playlistId, uris, tokens) {
  const populateUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  try {
    return spotifyPost(populateUrl, tokens, {}, {
      uris,
    });
  } catch (err) {
    throw err;
  }
}

async function replacePlaylistMusics(playlistId, uris, tokens) {
  const populateUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  try {
    return spotifyPut(populateUrl, tokens, {}, {
      uris,
    });
  } catch (err) {
    throw err;
  }
}

async function getRecommendations(tokens, seeds, limit) {
  const url = 'https://api.spotify.com/v1/recommendations';
  const { artists, tracks, genres } = seeds;

  const aStr = extractSeeds(artists);
  const tStr = extractSeeds(tracks);
  const gStr = extractSeeds(genres);

  return spotifyGet(url, tokens, {
    seed_artists: aStr,
    seed_tracks: tStr,
    seed_genres: gStr,
    limit,
  });
}

async function createPlaylist(uid, tokens, playlistName) {
  const createUrl = `https://api.spotify.com/v1/users/${uid}/playlists`;
  return spotifyPost(createUrl, tokens, {}, {
    name: playlistName,
  });
}

module.exports = {
  token,
  spotifyGet,
  spotifyPost,
  spotifyPut,
  getApiUser,
  getTop,
  getApiTopArtists,
  getApiTopTracks,
  getAllPlaylists,
  getApiPlaylists,
  getRecommendations,
  addMusicsToPlaylist,
  createPlaylist,
  replacePlaylistMusics,
};
