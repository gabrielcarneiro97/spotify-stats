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

async function spotifyGet(url, { access_token: at }) {
  try {
    const axiosRes = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${at}`,
      },
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
  const tokens = await getDBTokens(uid);
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
}

async function getApiUser(tokens) {
  try {
    const user = await spotifyGet('https://api.spotify.com/v1/me', tokens);
    return user;
  } catch (err) {
    throw err;
  }
}

exports.getUser = functions.https.onRequest(async (req, res) => {
  cors(res);
  const { uid } = req.query;
  try {
    const tokens = await checkRefresh(uid);
    const user = await getApiUser(tokens);
    res.send(user);
  } catch (err) {
    throw err;
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
