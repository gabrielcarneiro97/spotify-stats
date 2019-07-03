import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import {
  Col,
  Row,
  Layout,
  Icon,
} from 'antd';
import { login } from '../services/auth.service';

const { Content } = Layout;

class GetCode extends Component {
  state = {
    render: (
      <Content style={{ minHeight: '92vh' }}>
        <Row>
          <Col xs={24} style={{ textAlign: 'center', marginTop: '10vh' }}>
            <Icon type="loading" style={{ fontSize: '20vh' }} />
          </Col>
        </Row>
      </Content>
    ),
  }

  async componentWillMount() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const user = await login(code);

    console.log(user);

    this.setState({
      render: <Redirect to="/" />,
    });
  }

  render() {
    const { render } = this.state;
    return render;
  }
}

export default GetCode;
