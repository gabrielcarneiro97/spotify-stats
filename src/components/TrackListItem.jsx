import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  List,
  Button,
  Tag,
} from 'antd';

import Player from './Player';
import MoreMenu from './MoreMenu';

import { maxLength } from '../services/string.service';

const linkClick = link => () => window.open(link, '_blank');

const { Item } = List;

function TrackListItem({
  track,
  playlists,
  onPlay,
  id,
}) {
  return (
    <Item
      key={id}
      actions={[(<Player
        changePlay={onPlay}
        songUrl={track.preview}
        id={id}
      />), (
        <MoreMenu track={track} playlists={playlists} />
      )]}
    >
      <Item.Meta
        title={(
          <Fragment>
            <Button
              type="link"
              onClick={linkClick(track.spotifyLink)}
              style={{
                fontWeight: 'bold',
              }}
            >
              {maxLength(track.name, 25)}
            </Button>
            <Tag
              visible={track.explicit}
              style={{
                fontSize: '10px',
                paddingLeft: '2px',
                paddingRight: '2px',
                margin: 0,
              }}
            >
              EXPLICIT
            </Tag>
          </Fragment>
        )}
        description={(
          <Button
            type="link"
            onClick={linkClick(track.artist.spotifyLink)}
          >
            {maxLength(track.artist.name, 25)}
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
