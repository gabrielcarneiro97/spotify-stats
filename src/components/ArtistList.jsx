import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Avatar,
  Button,
  Card,
} from 'antd';


const linkClick = link => () => window.open(link, '_blank');

function ArtistList(props) {
  const {
    artists,
    type,
    title,
    loading,
  } = props;

  console.log(artists);
  return (
    <Card title={title} loading={loading}>
      <List
        itemLayout="vertical"
        size="small"
        dataSource={artists}
        footer={(
          <div>
            <b>STATSFY</b>
          </div>
        )}
        renderItem={(artist, i) => (
          <List.Item
            key={`${artist.id}-${type}`}
            extra={(
              <img
                src={artist.image}
                alt="cover"
                width="64px"
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
              title={<Button type="link" onClick={linkClick(artist.spotifyLink)} style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>{artist.name}</Button>}
              // description={<Button type="link" onClick={linkClick(track.artist.spotifyLink)}>{track.artist.name}</Button>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

ArtistList.propTypes = {
  artists: PropTypes.array, //eslint-disable-line
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ArtistList;
