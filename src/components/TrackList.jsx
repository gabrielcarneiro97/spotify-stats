import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Avatar,
  Button,
  Card,
} from 'antd';

import Player from './Player';

import { maxLength } from '../services/string.service';

const linkClick = link => () => window.open(link, '_blank');

class TrackList extends Component {
  static propTypes = {
    tracks: PropTypes.array, //eslint-disable-line
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  state = {
    playingNow: null,
  };

  handlePlay = (player) => {
    const { playingNow } = this.state;
    if (playingNow) {
      if (playingNow.props.id === player.props.id) {
        playingNow.setState({ playing: false }, () => {
          this.setState({ playingNow: null });
        });
      } else {
        playingNow.setState({ playing: false }, () => {
          player.setState({ playing: true }, () => {
            this.setState({ playingNow: player });
          });
        });
      }
    } else {
      player.setState({ playing: true }, () => {
        this.setState({ playingNow: player });
      });
    }
  }

  render() {
    const {
      tracks,
      type,
      title,
      loading,
    } = this.props;
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
                <Player
                  changePlay={this.handlePlay}
                  songUrl={track.preview}
                  imgUrl={track.album.cover}
                  id={`${track.id}-${type}`}
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
                    onClick={linkClick(track.spotifyLink)}
                    style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
                  >
                    {maxLength(track.name, 21)}
                  </Button>
                )}
                description={<Button type="link" onClick={linkClick(track.artist.spotifyLink)}>{maxLength(track.artist.name)}</Button>}
              />
            </List.Item>
          )}
        />
      </Card>
    );
  }
}

export default TrackList;
