import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import playPause from '../assets/play-pause.png';
import './Player.css';

class Player extends Component {
  static propTypes = {
    imgUrl: PropTypes.string.isRequired,
    songUrl: PropTypes.string,
  }

  static defaultProps = {
    songUrl: null,
  }

  state = {
    playing: false,
  }

  handleClick = () => {
    this.setState(prevState => ({
      playing: !prevState.playing,
    }));
  }

  render() {
    const { imgUrl, songUrl } = this.props;
    const { playing } = this.state;
    if (!songUrl) {
      return (
        <img
          width={64}
          alt="cover"
          src={imgUrl}
        />
      );
    }
    return (
      <div
        onClick={this.handleClick}
        role="button"
        tabIndex={0}
        onKeyPress={this.handleClick}
        id="container"
      >
        <img
          src={imgUrl}
          alt="cover"
          width={64}
          id="cover"
        />
        <img
          src={playPause}
          alt="play-pause"
          width={64}
          id="overlay"
        />
        <ReactPlayer url={songUrl} playing={playing} width={0} height={0} volume={0.1} />
      </div>
    );
  }
}

export default Player;
