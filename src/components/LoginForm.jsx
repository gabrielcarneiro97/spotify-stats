import React, { Component } from 'react';
import {
  Form,
  Button,
} from 'antd';
import propTypes from 'prop-types';

import { spotifyRedirect } from '../services/auth.service';
import { Text } from './LanguageManager';
import IconFont from './IconFont';


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

  handleSpotify = async () => {
    await spotifyRedirect();
  };

  render() {
    return (
      <Form className="login-form">
        <FormItem className="center-text">
          <Button size="large" className="login-form-button" onClick={this.handleSpotify}>
            <IconFont type="icon-spotify" />
            &nbsp;
            <span style={{ marginLeft: 5 }}>
              <Text dicio={{
                pt: 'Entrar com Spotify',
                en: 'Sign In with Spotify',
              }}
              />
            </span>
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(LoginForm);
