import React, { Component } from 'react';
import {
  Form,
  Icon,
  Button,
} from 'antd';
import propTypes from 'prop-types';

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
    // const { props } = this;
    // const { from } = props.history.location.state || { from: { pathname: '/app' } };
    spotifyRedirect();
  };

  render() {
    return (
      <Form className="login-form">
        <FormItem className="center-text">
          <Button className="login-form-button" onClick={this.handleSpotify}>
            <Icon type="spotify" />
            Entrar com Spotify
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(LoginForm);
