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

function extractGenres(artists) {
  let genres = Object.keys(artists).map((k) => {
    const artist = artists[k];
    return artist.genres;
  });

  genres = [...new Set([].concat(...genres))];

  return genres;
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

function extractUris(items) {
  return Object.keys(items).map(k => items[k].uri);
}

function extractSeeds(arr) {
  return Array.isArray(arr) ? decodeURI(arr.join(',')) : null;
}

module.exports = {
  extractArtistData,
  extractTrackData,
  extractGenres,
  extractPlaylistData,
  extractUris,
  extractSeeds,
};
