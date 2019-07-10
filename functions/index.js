const corsConfig = require('cors');

const { spotify } = require('./private');
const { root } = require('./public');

const { functions } = require('./services/firebase.service');
const {
  token,
  getApiUser,
  getApiTopArtists,
  getApiTopTracks,
  getAllPlaylists,
  getApiPlaylists,
  getRecommendations,
  addMusicsToPlaylist,
  createPlaylist,
  replacePlaylistMusics,
} = require('./services/spotifyHttps.service');
// const { getVideoUrl } = require('./services/youtubeHttps.service');
const { saveDBTokens, checkRefresh } = require('./services/db.service');
const { extractUris, extractGenres, extractTrackData } = require('./services/dataFilter.service');
const { error } = require('./services/error.service');

const cors = corsConfig({ origin: root });

exports.createPlaylist = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { uid, playlistName } = req.query;
    const { tracks } = req.body;
    const uris = extractUris(tracks);
    try {
      const tokens = await checkRefresh(uid);
      const { items: playlists } = await getAllPlaylists(uid, tokens);
      const exists = playlists.find(playlist => playlist.name === playlistName && playlist.isOwner);

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
        const data = await createPlaylist(uid, tokens, playlistName);
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
      const [artists, tracks] = await Promise.all([
        getApiTopArtists(tokens),
        getApiTopTracks(tokens),
      ]);

      const longMatches = [1, 3, 7, 17];
      const mediumMatches = [4, 8, 10, 16];
      const shortMatches = [1, 3, 12, 15, 18];

      const [topArtistsId, topTracksId] = await Promise.all([
        new Promise((resolve) => {
          const endArr = Object.keys(artists).filter((key) => {
            const artist = artists[key];
            const { long, medium, short } = artist.pos;

            return (
              longMatches.includes(long)
              || mediumMatches.includes(medium)
              || shortMatches.includes(short)
            );
          });

          resolve(endArr);
        }),
        new Promise((resolve) => {
          const endArr = Object.keys(tracks).filter((key) => {
            const track = tracks[key];
            const { long, medium, short } = track.pos;

            return (
              longMatches.includes(long)
              || mediumMatches.includes(medium)
              || shortMatches.includes(short)
            );
          });

          resolve(endArr);
        }),
      ]);

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
      const musics = await Promise.all(requests.map(async (r) => {
        const { artists: aIds, tracks: tIds } = r;

        return getRecommendations(tokens, {
          artists: aIds,
          tracks: tIds,
        }, 30);
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

    try {
      const tokens = await checkRefresh(uid);

      const allTracks = {};

      const extractFromItems = items => items.forEach((t, i) => {
        const track = allTracks[t.id] || extractTrackData(t);
        track.pos.rec = i + 1;
        allTracks[track.id] = track;
      });

      const { tracks } = await getRecommendations(tokens, {
        tracks: tracksArrId,
        artists: artistsArrId,
        genres: genresArrId,
      }, 30);

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

// exports.youtubeLink = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     try {
//       const { query } = req.query;
//       const url = await getVideoUrl(query);
//       res.send(url);
//     } catch (err) {
//       error(err, res);
//     }
//   });
// });
