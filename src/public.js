const prod = process.env.NODE_ENV === 'production';

module.exports = {
  root: prod ? '' : 'http://localhost:3000',
  api: prod ? '' : 'http://localhost:5001/spotifystatsapp/us-central1',
};
