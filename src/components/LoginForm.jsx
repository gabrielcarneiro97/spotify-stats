import React, { Component } from 'react';
import {
  Form,
  Button,
} from 'antd';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSpotify } from '@fortawesome/free-brands-svg-icons';

import { spotifyRedirect } from '../services/auth.service';


import './LoginForm.css';

const FormItem = Form.Item;


class LoginForm extends Component {
  static propTypes = {
    history: propTypes.shape({
      push: propTypes.func,
      location: propTypes.object,
    }).isRequired,
    form: propTypes.shape({
      getFieldDecorator: propTypes.func,
      validateFields: propTypes.func,
    }).isRequired,
  }

  handleSpotify = () => {
    spotifyRedirect();
  };

  render() {
    return (
      <Form className="login-form">
        <FormItem className="center-text">
          <Button size="large" className="login-form-button" onClick={this.handleSpotify}>
            <FontAwesomeIcon icon={faSpotify} />
            <span style={{ marginLeft: 5 }}>
              Sign in with Spotify
            </span>
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(LoginForm);
