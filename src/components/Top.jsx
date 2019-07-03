import React, { Component, Fragment } from 'react';
import { Card, Col } from 'antd';
import { getTop } from '../services/api.service';

import TopChart from './TopChart';

function reverseObj(objParam) {
  const obj = { ...objParam };
  const objKeys = Object.keys(obj);
  const objCount = objKeys.length - objKeys.filter(k => obj[k] === null).length;

  objKeys.forEach((k) => {
    if (obj[k] !== null) obj[k] = objCount - (obj[k] - 1);
  });

  return obj;
}

function setData(data) {
  let dataLong = {};
  let dataMedium = {};
  let dataShort = {};

  Object.keys(data).forEach((k) => {
    const obj = data[k];
    const { pos } = obj;

    dataLong[obj.name] = pos.long;
    dataMedium[obj.name] = pos.medium;
    dataShort[obj.name] = pos.short;
  });

  dataLong = reverseObj(dataLong);
  dataMedium = reverseObj(dataMedium);
  dataShort = reverseObj(dataShort);

  dataLong.xAxisChart = 'long';
  dataMedium.xAxisChart = 'medium';
  dataShort.xAxisChart = 'short';

  return [dataLong, dataMedium, dataShort];
}

class Top extends Component {
  state = {
    loading: true,
  }

  async componentWillMount() {
    const top = await getTop();


    const trackData = setData(top.tracks);
    const artistData = setData(top.artists);

    this.setState({ trackData, artistData, loading: false });
  }

  render() {
    const { loading, trackData, artistData } = this.state;
    return (
      <Fragment>
        <Col xs={24} lg={12}>
          <Card title="Music Top 20" loading={loading}>
            <div style={{ height: '50vh' }}>
              <TopChart data={trackData} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Artist Top 20" loading={loading}>
            <div style={{ height: '50vh' }}>
              <TopChart data={artistData} />
            </div>
          </Card>
        </Col>
      </Fragment>
    );
  }
}

export default Top;
