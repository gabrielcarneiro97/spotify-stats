import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Card,
  Button,
  Input,
} from 'antd';

import TrackList from './TrackList';
import { Text } from './LanguageManager';

function trackSort(type) {
  return (a, b) => {
    if (a.pos[type] < b.pos[type]) return -1;
    if (a.pos[type] > b.pos[type]) return 1;
    return 0;
  };
}

function filterTracks(tracks) {
  const rec = [];

  Object.keys(tracks).forEach((k) => {
    const track = tracks[k];
    rec.push(track);
  });

  rec.sort(trackSort('rec'));

  return rec;
}

class QuizEnd extends Component {
  state = {
    playlistName: '',
  }

  handlePlaylistChange = (e) => {
    const { value } = e.target;

    this.setState({ playlistName: value });
  }

  render() {
    const { tracks, clickSend, history } = this.props;
    const { playlistName } = this.state;
    const loading = !tracks;
    const rec = loading ? null : filterTracks(tracks);
    return (
      <Row type="flex" justify="center" align="middle" style={{ marginTop: '10vh', marginBottom: '10vh' }}>
        <Col xs={24} md={20}>
          <Card title={<Text dicio={{ pt: 'Aqui está sua Playlist!', en: 'Here is your Playlist!' }} />} loading={loading}>
            <Row>
              <TrackList
                tracks={rec}
                type="rec"
                title="Playlist"
                loading={loading}
                pagination={{ pageSize: 5 }}
              />
            </Row>
            <Row type="flex" justify="end" align="middle" style={{ marginTop: '2vh' }}>
              <Col xs={24}>
                <Input
                  addonBefore={<Text dicio={{ pt: 'Nome da Playlist:', en: 'Playlist Name:' }} />}
                  value={playlistName}
                  onChange={this.handlePlaylistChange}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} style={{ textAlign: 'center', marginTop: '2vh' }}>
                <Button type="primary" size="large" onClick={() => clickSend(playlistName)} disabled={loading}>
                  <Text dicio={{ pt: 'Exportar para o Spotify!', en: 'Send to Spotify!' }} />
                </Button>
              </Col>
            </Row>
            <Row type="flex" justify="center" align="middle" style={{ marginTop: '2vh' }}>
              <Col xs={24} style={{ textAlign: 'center' }}>
                <Button size="large" onClick={() => history.push('/')}>
                  <Text dicio={{ pt: 'Voltar', en: 'Go Back' }} />
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

QuizEnd.propTypes = {
  tracks: PropTypes.object, // eslint-disable-line
  clickSend: PropTypes.func.isRequired,
  history: PropTypes.object, // eslint-disable-line
};

QuizEnd.defaultProps = {
  tracks: null,
};


export default withRouter(QuizEnd);
