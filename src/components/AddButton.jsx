import React, { Component } from 'react';
import { Avatar } from 'antd';

class AddButton extends Component {
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
