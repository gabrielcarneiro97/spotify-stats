const { root } = require('../public');

class Err {
  constructor(code, desc) {
    this.code = code;
    this.description = desc;
  }
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

module.exports = {
  Err,
  error,
};
