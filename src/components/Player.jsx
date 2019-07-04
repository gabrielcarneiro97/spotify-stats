import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ReactPlayer from 'react-player';

import './Player.css';
import defaultImg from '../assets/default-cover.png';

class Player extends Component {
  static propTypes = {
    changePlay: PropTypes.func,
    imgUrl: PropTypes.string.isRequired,
    songUrl: PropTypes.string,
  }

  static defaultProps = {
    songUrl: null,
    changePlay: () => null,
  }

  state = {
    playing: false,
  }

  handleClick = () => {
    const { changePlay } = this.props;
    changePlay(this);
  }

  render() {
    const { imgUrl, songUrl } = this.props;
    const { playing } = this.state;

    const img = imgUrl || defaultImg;


    if (!songUrl) {
      return (
        <img
          width={64}
          alt="cover"
          src={img}
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
          src={img}
          alt="cover"
          width={64}
          id="cover"
        />
        {(() => (
          playing
            ? (
              <Icon
                type="pause-circle"
                className="overlay"
                style={{ color: 'rgba(0, 0, 0, 0.85)' }}
              />
            )
            : (
              <Icon
                type="play-circle"
                className="overlay"
                style={{ color: 'rgba(0, 0, 0, 0.85)' }}
              />
            )
        ))()}
        <ReactPlayer url={songUrl} playing={playing} width={0} height={0} volume={0.1} />
      </div>
    );
  }
}

export default Player;
