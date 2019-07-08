import React from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Layout,
  Typography,
} from 'antd';

import calopsita from '../assets/calopsita.png';

const { Content } = Layout;
const { Title } = Typography;

function Page404() {
  return (
    <Layout>
      <Content style={{
        minHeight: window.innerHeight - 64,
      }}
      >
        <Row
          type="flex"
          justify="center"
          align="top"
          style={{
            marginTop: '20vh',
          }}
        >
          <Col
            style={{
              textAlign: 'end',
            }}
          >
            <Title level={2}>
              404
              <br />
              Página não encontrada
            </Title>
            <Title level={4}>
              Talvez a calopsita mágica possa te ajudar, clica&nbsp;
              <Link to="/">aqui</Link>
              .
            </Title>
          </Col>
          <Col style={{ marginLeft: '20px' }}>
            <img src={calopsita} alt="calopstita" />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Page404;
