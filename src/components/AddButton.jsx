import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class AddButton extends Component {
  static propTypes = {
    text: PropTypes.oneOfType([
      PropTypes.string, PropTypes.object,
    ]).isRequired,
    musicUri: PropTypes.string.isRequired,
  }

  state = {};

  render() {
    const { text, musicUri } = this.props;
    console.log(musicUri);
    return (
      <Button shape="circle">
        {text}
      </Button>
    );
  }
}

export default AddButton;
