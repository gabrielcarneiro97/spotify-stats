import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Avatar,
  Button,
  Card,
} from 'antd';

const linkClick = link => () => window.open(link, '_blank');

function TrackList(props) {
  const {
    tracks,
    type,
    title,
    loading,
  } = props;
  if (tracks) console.log(tracks[0].preview);
  return (
    <Card title={title} loading={loading}>
      <List
        itemLayout="vertical"
        size="small"
        dataSource={tracks}
        footer={(
          <div>
            <b>STATSFY</b>
          </div>
        )}
        renderItem={(track, i) => (
          <List.Item
            key={`${track.id}-${type}`}
            extra={(
              <img
                width={64}
                alt="cover"
                src={track.album.cover}
              />
            )}
          >
            <List.Item.Meta
              avatar={(
                <Avatar>
                  {i + 1}
                  .
                </Avatar>
              )}
              title={<Button type="link" onClick={linkClick(track.spotifyLink)} style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>{track.name}</Button>}
              description={<Button type="link" onClick={linkClick(track.artist.spotifyLink)}>{track.artist.name}</Button>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

TrackList.propTypes = {
  tracks: PropTypes.array, //eslint-disable-line
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default TrackList;
