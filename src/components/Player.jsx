import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class Player extends Component {
  static propTypes = {
    changePlay: PropTypes.func,
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
    const { changePlay, songUrl } = this.props;
    changePlay(this, songUrl);
  }

  render() {
    const { songUrl } = this.props;
    const { playing } = this.state;

    const icon = playing ? 'pause' : 'caret-right';

    return (
      <Fragment>
        <Button onClick={this.handleClick} shape="circle" icon={icon} disabled={!songUrl} size="large" />
      </Fragment>
    );
  }
}

export default Player;
