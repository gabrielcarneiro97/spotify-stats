const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const qs = require('querystring');
const { spotify } = require('../src/private');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const tokensCol = db.collection('tokens');

function cors(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
}

function getError(data) {
  return {
    name: data.response.data.error,
    desc: data.response.data.error_description,
  };
}

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
  } catch (data) {
    const err = getError(data);
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

async function getDBTokens(uid) {
  try {
    const tokens = (await tokensCol.doc(uid).get()).data();
    return tokens;
  } catch (err) {
    throw err;
  }
}

async function saveDBTokens(uid, data) {
  try {
    await tokensCol.doc(uid).set(data);
    return data;
  } catch (err) {
    throw err;
  }
}

async function checkRefresh(uid) {
  try {
    const tokens = await getDBTokens(uid);
    if (!tokens) throw new Error('Usuário não encontrado!');
    const date = new Date(tokens.date);
    if (date <= new Date()) {
      try {
        const news = await token('refresh_token', tokens.refresh_token);

        const newsTokens = {
          ...tokens,
          ...news,
        };

        return saveDBTokens(uid, newsTokens);
      } catch (err) {
        throw err;
      }
    }
    return tokens;
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

function extractArtistData(artist) {
  return {
    id: artist.id,
    name: artist.name,
    spotifyLink: artist.external_urls.spotify,
    followers: artist.followers.total,
    popularity: artist.popularity,
    genres: artist.genres,
    image: artist.images[0].url,
    pos: {
      long: null,
      medium: null,
      short: null,
    },
  };
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

function extractTrackData(track) {
  return {
    id: track.id,
    name: track.name,
    spotifyLink: track.external_urls.spotify,
    preview: track.preview_url,
    popularity: track.popularity,
    artist: {
      name: track.artists[0].name,
      spotifyLink: track.artists[0].external_urls.spotify,
      id: track.artists[0].id,
    },
    album: {
      name: track.album.name,
      spotifyLink: track.album.external_urls.spotify,
      releaseDate: track.album.release_date,
      cover: track.album.images[0].url,
    },
    pos: {
      long: null,
      medium: null,
      short: null,
    },
  };
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

exports.getTop = functions.https.onRequest(async (req, res) => {
  cors(res);
  const { uid } = req.query;
  try {
    const tokens = await checkRefresh(uid);
    const artists = await getApiTopArtists(tokens);
    const tracks = await getApiTopTracks(tokens);

    res.send({
      artists,
      tracks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

exports.getUser = functions.https.onRequest(async (req, res) => {
  cors(res);
  const { uid } = req.query;
  try {
    const tokens = await checkRefresh(uid);
    const user = await getApiUser(tokens);
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

exports.spotifyLogin = functions.https.onRequest(async (req, res) => {
  cors(res);
  const { code } = req.query;
  try {
    const tokens = await token('code', code);
    const user = await getApiUser(tokens);

    await saveDBTokens(user.id, tokens);

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});
