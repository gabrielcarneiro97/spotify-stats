import React, { Component } from 'react';
import { Col, Row, Layout } from 'antd';

import { getTop } from '../services/api.service';

import TrackList from './TrackList';


const { Content } = Layout;


function trackSort(type) {
  return (a, b) => {
    if (a.pos[type] < b.pos[type]) return -1;
    if (a.pos[type] > b.pos[type]) return 1;
    return 0;
  };
}


function filterTracks(tracks) {
  const long = [];
  const medium = [];
  const short = [];

  Object.keys(tracks).forEach((k) => {
    const track = tracks[k];
    const { pos } = track;

    if (pos.long) long.push(track);
    if (pos.medium) medium.push(track);
    if (pos.short) short.push(track);
  });

  long.sort(trackSort('long'));
  medium.sort(trackSort('medium'));
  short.sort(trackSort('short'));


  return { long, medium, short };
}


class TracksDetails extends Component {
  state = {
    loading: true,
  }

  async componentWillMount() {
    const { tracks } = await getTop();

    const { long, medium, short } = filterTracks(tracks);

    console.log(long, medium, short);

    this.setState({ long, medium, short, loading: false });
  }


  render() {
    const {
      long,
      medium,
      short,
      loading,
    } = this.state;
    return (
      <Content style={{ minHeight: '92vh' }}>
        <Row type="flex" gutter={5} style={{ margin: 10 }}>
          <Col xs={24} xl={8}>
            <TrackList tracks={short} type="short" title="Last Month" loading={loading} />
          </Col>
          <Col xs={24} xl={8}>
            <TrackList tracks={medium} type="medium" title="Last 6 Months" loading={loading} />
          </Col>
          <Col xs={24} xl={8}>
            <TrackList tracks={long} type="long" title="Always" loading={loading} />
          </Col>
        </Row>
      </Content>
    );
  }
}

export default TracksDetails;
