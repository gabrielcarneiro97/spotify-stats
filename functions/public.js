const prod = process.env.NODE_ENV === 'production';

module.exports = {
  root: prod ? 'https://statsfy.app' : 'http://localhost:3000',
  api: prod ? 'https://us-central1-spotifystatsapp.cloudfunctions.net' : 'http://localhost:5001/spotifystatsapp/us-central1',
};
