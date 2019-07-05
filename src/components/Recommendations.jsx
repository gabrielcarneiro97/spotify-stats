import React, { Component } from 'react';
import { Col } from 'antd';

import { getRecs } from '../services/api.service';
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

class Recommendations extends Component {
  state = {
    loading: true,
  }

  async componentWillMount() {
    const { tracks } = await getRecs();

    const rec = filterTracks(tracks);

    this.setState({
      rec,
      loading: false,
    });
  }


  render() {
    const {
      rec,
      loading,
    } = this.state;
    return (
      <Col xs={24} xl={12} style={{ marginTop: 10 }}>
        <TrackList
          tracks={rec}
          type="rec"
          title={(
            <Text dicio={{
              en: 'Recommendations',
              pt: 'Recomendações',
            }}
            />
          )}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Col>
    );
  }
}

export default Recommendations;
