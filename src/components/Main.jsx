import React from 'react';
import { Col, Row, Layout } from 'antd';

import UserInfos from './UserInfos';
import Top from './Top';
import Recommendations from './Recommendations';

const { Content } = Layout;

function Main() {
  return (
    <Content style={{ minHeight: '92vh' }}>
      <Row type="flex" style={{ margin: 10 }}>
        <Col xs={24}>
          <UserInfos />
        </Col>
      </Row>
      <Row style={{ margin: 5 }} gutter={10}>
        <Top />
      </Row>
      <Recommendations />
    </Content>
  );
}

export default Main;
