import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Button,
  Card,
} from 'antd';

import Player from './Player';
import AddButton from './AddButton';
import { Text } from './LanguageManager';

import { maxLength } from '../services/string.service';

const linkClick = link => () => window.open(link, '_blank');

class TrackList extends Component {
  static propTypes = {
    tracks: PropTypes.array, //eslint-disable-line
    type: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([PropTypes.instanceOf(Text), PropTypes.string ]).isRequired,
    loading: PropTypes.bool.isRequired,
    pagination: PropTypes.object // eslint-disable-line
  };

  static defaultProps = {
    pagination: null,
  }

  state = {
    playingNow: null,
  };

  stopMusic = () => {
    const { playingNow } = this.state;
    if (playingNow) {
      playingNow.setState({ playing: false }, () => {
        this.setState({ playingNow: null });
      });
    }
  }

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
      pagination,
    } = this.props;

    const pag = pagination === null ? null : {
      onChange: this.stopMusic,
      simple: true,
      ...pagination,
    };
    return (
      <Card title={title} loading={loading}>
        <List
          size="small"
          pagination={pag}
          dataSource={tracks}
          footer={(
            <div>
              <b>STATSFY</b>
            </div>
          )}
          renderItem={(track) => {
            const avatarColor = track.preview ? '#6EFF49' : '';
            return (
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
                    <AddButton text={`${track.pos[type]}.`} color={avatarColor} musicUri={track.uri} />
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
              </List.Item>
            );
          }}
        />
      </Card>
    );
  }
}

export default TrackList;
