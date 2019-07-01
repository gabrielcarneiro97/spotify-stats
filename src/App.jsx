import React, { Component, Fragment } from 'react';
import { Row, Col, Button } from 'antd';

import { spotify } from './private';

import './App.css';


function spotifyAuthLink() {
  const base = 'https://accounts.spotify.com/authorize?';
  const clientId = `client_id=${encodeURI(spotify.clientId)}`;
  const responseType = '&response_type=code';
  const redirectUri = `&redirect_uri=${encodeURI('http://localhost:3000/')}`;
  const scope = `&scope=${encodeURI('user-library-read')}`;

  return base + clientId + responseType + redirectUri + scope;
}

function spotifyApiTokenLink() {
  
}

class App extends Component {
  componentWillMount() {
    console.log('willMount');
    const locale = new URL(window.location.href);

    this.setState({
      code: locale.searchParams.get('code'),
    });
  }

  login = async () => {
    window.location.href = spotifyAuthLink();
    this.setState({});
  }

  isAuth = () => {
    const { code } = this.state;
    return !!code;
  }

  render() {
    if (!this.isAuth()) {
      return (
        <div>
          <Row>
            <Col span={12} style={{ backgroundColor: 'blue' }}>
              <Button onClick={this.login}>Spotify</Button>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <Fragment>
        <div>
          LOGADO!!
        </div>
      </Fragment>
    );
  }
}
export default App;
