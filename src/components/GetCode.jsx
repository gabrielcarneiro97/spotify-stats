import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { login } from '../services/auth.service';

class GetCode extends Component {
  state = {
    redirect: '',
  }

  async componentWillMount() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    const { data: user } = await login(code);

    console.log(user);

    this.setState({
      redirect: <Redirect to="/" />,
    });
  }

  render() {
    const { redirect } = this.state;
    return redirect;
  }
}

export default GetCode;
