const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const qs = require('querystring');
const corsConfig = require('cors');

const { spotify } = require('./private');
const { root } = require('./public');

const cors = corsConfig({ origin: root });

admin.initializeApp(functions.config().firestore);

const db = admin.firestore();

const tokensCol = db.collection('tokens');

class Err {
  constructor(code, desc) {
    this.code = code;
    this.description = desc;
  }
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
    if (!tokens) throw new Err(401);
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
    uri: artist.uri,
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
      rec: null,
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
  const cover = (() => {
    if (track.album.images) {
      if (track.album.images[0]) {
        if (track.album.images[0].url) return track.album.images[0].url;
        return null;
      }
      return null;
    }
    return null;
  })();
  return {
    id: track.id,
    uri: track.uri,
    explicit: track.explicit,
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
      cover,
    },
    pos: {
      long: null,
      medium: null,
      short: null,
      rec: null,
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

async function getAllPlaylists(uid, tokens) {
  return spotifyGet(`https://api.spotify.com/v1/users/${uid}/playlists`, tokens);
}

function extractPlaylistData(playlist, uid) {
  const cover = (() => {
    if (playlist.images) {
      if (playlist.images.length > 0) {
        return playlist.images[0].url;
      }
      return null;
    }
    return null;
  })();

  const isOwner = playlist.owner.id === uid;
  const editable = isOwner || playlist.collaborative;

  return {
    name: playlist.name,
    id: playlist.id,
    uri: playlist.uri,
    cover,
    editable,
    isOwner,
    owner: {
      id: playlist.owner.id,
      type: playlist.owner.type,
    },
  };
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

function extractGenres(artists) {
  let genres = Object.keys(artists).map((k) => {
    const artist = artists[k];
    return artist.genres;
  });

  genres = [...new Set([].concat(...genres))];

  return genres;
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

function extractUris(items) {
  return Object.keys(items).map(k => items[k].uri);
}

function error(err, res) {
  if (err.code) {
    if (err.code === '401') {
      res.cookie('uidStatsfy', '');
      res.status(401).redirect(`${root}/login`);
    } else {
      console.error(err);
      res.status(500).send(err);
    }
  } else {
    console.error(err);
    res.status(500).send(err);
  }
}

exports.createPlaylist = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { uid, playlistName } = req.query;
    const { tracks } = req.body;
    const uris = extractUris(tracks);
    const createUrl = `https://api.spotify.com/v1/users/${uid}/playlists`;
    try {
      const tokens = await checkRefresh(uid);
      const { items: playlists } = await getAllPlaylists(uid, tokens);
      const exists = playlists.find(playlist => playlist.name === playlistName);

      const populate = async (playlistId) => {
        try {
          await replacePlaylistMusics(playlistId, uris, tokens);
          res.sendStatus(201);
        } catch (err) {
          error(err, res);
        }
      };

      if (exists) {
        const playlistId = exists.id;
        populate(playlistId);
      } else {
        const data = await spotifyPost(createUrl, tokens, {}, {
          name: playlistName,
        });
        const playlistId = data.id;
        populate(playlistId);
      }
    } catch (err) {
      error(err, res);
    }
  });
});

exports.getTop = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { uid } = req.query;
    try {
      const tokens = await checkRefresh(uid);
      const artists = await getApiTopArtists(tokens);
      const tracks = await getApiTopTracks(tokens);
      const genres = extractGenres(artists);

      res.send({
        artists,
        tracks,
        genres,
      });
    } catch (err) {
      error(err, res);
    }
  });
});

exports.getUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { uid } = req.query;
    try {
      const tokens = await checkRefresh(uid);
      const user = await getApiUser(tokens);
      res.send(user);
    } catch (err) {
      error(err, res);
    }
  });
});

exports.getPlaylists = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { uid } = req.query;
    try {
      const tokens = await checkRefresh(uid);
      const playlists = await getApiPlaylists(uid, tokens);
      res.send(playlists);
    } catch (err) {
      error(err, res);
    }
  });
});

exports.getRecs = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { uid } = req.query;
    try {
      const tokens = await checkRefresh(uid);
      const artists = await getApiTopArtists(tokens);
      const tracks = await getApiTopTracks(tokens);

      const longMatches = [1, 3, 7, 17];
      const mediumMatches = [4, 8, 10, 16];
      const shortMatches = [1, 3, 12, 15, 18];

      const topArtistsId = Object.keys(artists).filter((key) => {
        const artist = artists[key];
        const { long, medium, short } = artist.pos;

        return (
          longMatches.includes(long)
          || mediumMatches.includes(medium)
          || shortMatches.includes(short)
        );
      });

      const topTracksId = Object.keys(tracks).filter((key) => {
        const track = tracks[key];
        const { long, medium, short } = track.pos;

        return (
          longMatches.includes(long)
          || mediumMatches.includes(medium)
          || shortMatches.includes(short)
        );
      });

      const requests = [];
      let reqCount = 0;
      while ((topTracksId.length + topArtistsId.length) > 0) {
        requests[reqCount] = {
          artists: [],
          tracks: [],
        };
        let track = true;
        const sumLen = r => r.artists.length + r.tracks.length;
        while ((sumLen(requests[reqCount])) < 4 && (topTracksId.length + topArtistsId.length) > 0) {
          if (topTracksId.length === 0) track = false;
          if (topArtistsId.length === 0) track = true;
          if (track) {
            requests[reqCount].tracks.push(topTracksId.pop());
            track = false;
          } else {
            requests[reqCount].artists.push(topArtistsId.pop());
            track = true;
          }
        }
        reqCount += 1;
      }
      const url = 'https://api.spotify.com/v1/recommendations';
      const musics = await Promise.all(requests.map(async (r) => {
        const { artists: aIds, tracks: tIds } = r;
        const aStr = aIds.join(',');
        const tStr = tIds.join(',');

        return spotifyGet(url, tokens, {
          seed_artists: aStr,
          seed_tracks: tStr,
          limit: 30,
        });
      }));

      const allTracks = {};

      const extractFromItems = (items, offset) => items.forEach((t, i) => {
        const track = allTracks[t.id] || extractTrackData(t);
        track.pos.rec = (i + 1) + (offset * 10);
        allTracks[track.id] = track;
      });

      musics.forEach(({ tracks: t }, i) => {
        extractFromItems(t, i);
      });

      res.send({ tracks: allTracks });
    } catch (err) {
      error(err, res);
    }
  });
});

exports.addMusic = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { uid, musicUri, playlistId } = req.query;
    try {
      const tokens = await checkRefresh(uid);
      const uris = [musicUri];

      await addMusicsToPlaylist(playlistId, uris, tokens);
      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err);
    }
  });
});

exports.playlistQuiz = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { uid, ...ans } = req.query;

    const artistsArrId = [];
    const tracksArrId = [];
    const genresArrId = [];

    Object.keys(ans).forEach((k) => {
      const d = ans[k];
      const [id, type] = d.split('|');

      if (type === 'genres') genresArrId.push(id);
      else if (type === 'tracks') tracksArrId.push(id);
      else artistsArrId.push(id);
    });

    const aStr = artistsArrId.join(',');
    const tStr = tracksArrId.join(',');
    const gStr = decodeURI(genresArrId.join(','));

    try {
      const tokens = await checkRefresh(uid);
      const url = 'https://api.spotify.com/v1/recommendations';

      const allTracks = {};

      const extractFromItems = items => items.forEach((t, i) => {
        const track = allTracks[t.id] || extractTrackData(t);
        track.pos.rec = i + 1;
        allTracks[track.id] = track;
      });

      const { tracks } = await spotifyGet(url, tokens, {
        seed_artists: aStr,
        seed_tracks: tStr,
        seed_genres: gStr,
        limit: 30,
      });

      extractFromItems(tracks);

      res.send({ allTracks });
    } catch (err) {
      error(err, res);
    }
  });
});

exports.spotifyLogin = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { code } = req.query;
    try {
      const tokens = await token('code', code);
      const user = await getApiUser(tokens);

      await saveDBTokens(user.id, tokens);

      res.send(user);
    } catch (err) {
      error(err, res);
    }
  });
});

exports.spotifyLink = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const base = 'https://accounts.spotify.com/authorize?';
    const clientId = `client_id=${spotify.clientId}`;
    const responseType = '&response_type=code';
    const redirectUri = `&redirect_uri=${spotify.encodedRedirectUri}`;
    const scope = `&scope=${spotify.encodedScopes}`;

    res.send(base + clientId + responseType + redirectUri + scope);
  });
});
