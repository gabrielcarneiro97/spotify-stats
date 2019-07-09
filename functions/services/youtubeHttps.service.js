const axios = require('axios');
const { firebase } = require('../private');

const { apiKey } = firebase;

async function getVideoUrl(query) {
  const url = 'https://www.googleapis.com/youtube/v3/search';
  try {
    const { data } = await axios.get(url, {
      params: {
        key: apiKey,
        part: 'id,snippet',
        q: encodeURI(query),
        maxResults: 1,
      },
    });
    const { videoId } = data.items[0].id;
    console.log(query, `https://www.youtube.com/watch?v=${videoId}`);

    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getVideoUrl,
};
