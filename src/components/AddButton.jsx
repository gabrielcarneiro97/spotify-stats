import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

import { Text } from './LanguageManager';

class AddButton extends Component {
  static propTypes = {
    text: PropTypes.oneOfType([
      PropTypes.string, PropTypes.instanceOf(Text),
    ]).isRequired,
    color: PropTypes.string.isRequired,
    musicUri: PropTypes.string.isRequired,
  }

  state = {};

  render() {
    const { text, color, musicUri } = this.props;
    console.log(musicUri);
    return (
      <Avatar style={{ backgroundColor: color }}>
        {text}
      </Avatar>
    );
  }
}

export default AddButton;
