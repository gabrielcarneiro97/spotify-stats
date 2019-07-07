import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  List,
  Button,
} from 'antd';

import Player from './Player';
import AddButton from './AddButton';

import { maxLength } from '../services/string.service';

import defaultImg from '../assets/default-cover.png';

const linkClick = link => () => window.open(link, '_blank');

const { Item } = List;

function TrackListItem({
  track,
  playlists,
  onPlay,
  id,
}) {
  const img = track.album.cover || defaultImg;
  return (
    <Item
      key={id}
      actions={[(<Player
        changePlay={onPlay}
        songUrl={track.preview}
        id={id}
      />), (
        <AddButton track={track} playlists={playlists} />
      )]}
    >
      <Item.Meta
        avatar={(
          <img alt="cover" src={img} width={64} style={{ borderRadius: '10px' }} />
        )}
        title={(
          <Fragment>
            <Button
              type="link"
              onClick={linkClick(track.spotifyLink)}
              style={{
                color: 'rgba(0, 0, 0, 0.85)',
                fontWeight: 'bold',
                paddingRight: '5px',
              }}
            >
              {maxLength(track.name, 21)}
            </Button>
          </Fragment>
        )}
        description={(
          <Button
            type="link"
            style={{ color: 'rgba(0,0,0,0.45)' }}
            onClick={linkClick(track.artist.spotifyLink)}
          >
            {maxLength(track.artist.name)}
          </Button>
        )}
      />
    </Item>
  );
}

TrackListItem.propTypes = {
  track: PropTypes.object.isRequired, // eslint-disable-line
  playlists: PropTypes.array.isRequired, // eslint-disable-line
  id: PropTypes.string.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default TrackListItem;
