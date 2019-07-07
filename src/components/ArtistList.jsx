import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Avatar,
  Button,
  Card,
} from 'antd';

import { maxLength } from '../services/string.service';

const linkClick = link => () => window.open(link, '_blank');

function ArtistList(props) {
  const {
    artists,
    type,
    title,
    loading,
    pagination,
  } = props;

  const pag = pagination === null ? null : {
    simple: true,
    ...pagination,
  };
  return (
    <Card title={title} loading={loading}>
      <List
        size="small"
        pagination={pag}
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
              title={(
                <Button
                  type="link"
                  onClick={linkClick(artist.spotifyLink)}
                  style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
                >
                  {maxLength(artist.name, 21)}
                </Button>
              )}
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
  title: PropTypes.object.isRequired, // eslint-disable-line
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object // eslint-disable-line
};

ArtistList.defautProps = {
  pagination: null,
};

export default ArtistList;
