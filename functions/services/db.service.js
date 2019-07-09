const { db } = require('./firebase.service');
const { token } = require('./spotifyHttps.service');
const { Err } = require('./error.service');

const tokensCol = db.collection('tokens');

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

module.exports = {
  getDBTokens,
  saveDBTokens,
  checkRefresh,
};
