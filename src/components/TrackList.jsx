import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  Card,
} from 'antd';

import ReactPlayer from 'react-player';


import { getPlaylists } from '../services/api.service';

import TrackListItem from './TrackListItem';


const inactivePlayer = <ReactPlayer url="" width={0} height={0} volume={0.1} playing={false} />;

class TrackList extends Component {
  static propTypes = {
    tracks: PropTypes.array, //eslint-disable-line
    type: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    pagination: PropTypes.object // eslint-disable-line
  };

  static defaultProps = {
    pagination: null,
  }


  state = {
    playingNow: null,
    loading: true,
    playlists: [],
    player: inactivePlayer,
  };

  async componentWillMount() {
    try {
      const playlists = await getPlaylists();
      this.setState({
        loading: false,
        playlists,
      });
    } catch (err) {
      console.log(err);
    }
  }

  stopMusic = () => {
    const { playingNow } = this.state;
    if (playingNow) {
      playingNow.setState({ playing: false });
      this.setState({ playingNow: null, player: inactivePlayer });
    }
  }

  handlePlay = (player, songUrl) => {
    const { playingNow } = this.state;
    if (playingNow) {
      if (playingNow.props.id === player.props.id) {
        this.setState();
        playingNow.setState({ playing: false }, () => {
          this.setState({ playingNow: null, player: inactivePlayer });
        });
      } else {
        playingNow.setState({ playing: false }, () => {
          player.setState({ playing: true }, () => {
            this.setState({ playingNow: player, player: <ReactPlayer url={songUrl} width={0} height={0} volume={0.1} playing /> });
          });
        });
      }
    } else {
      player.setState({ playing: true }, () => {
        this.setState({ playingNow: player, player: <ReactPlayer url={songUrl} width={0} height={0} volume={0.1} playing /> });
      });
    }
  }

  render() {
    const {
      tracks,
      type,
      title,
      pagination,
    } = this.props;
    const {
      playlists,
      loading: loadingState,
      player,
    } = this.state;

    const loading = ((!tracks) || loadingState);

    const pag = pagination === null ? null : {
      onChange: this.stopMusic,
      simple: true,
      ...pagination,
    };
    return (
      <Card title={title} loading={loading}>
        {player}
        <List
          size="small"
          pagination={pag}
          dataSource={tracks}
          footer={(
            <div>
              <b>STATSFY</b>
            </div>
          )}
          renderItem={track => (
            <TrackListItem
              track={track}
              playlists={playlists}
              onPlay={this.handlePlay}
              id={`${track.id}-${type}`}
            />
          )}
        />
      </Card>
    );
  }
}

export default TrackList;
