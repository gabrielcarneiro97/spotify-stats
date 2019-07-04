import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ReactPlayer from 'react-player';

import './Player.css';

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
        {(() => (
          playing
            ? (
              <Icon
                type="pause-circle"
                className="overlay"
              />
            )
            : (
              <Icon
                type="play-circle"
                className="overlay"
              />
            )
        ))()}
        <ReactPlayer url={songUrl} playing={playing} width={0} height={0} volume={0.1} />
      </div>
    );
  }
}

export default Player;
