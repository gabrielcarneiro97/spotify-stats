import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Row,
  Col,
  Icon,
  Button,
} from 'antd';
import PropTypes from 'prop-types';

import { auth } from '../services/auth.service';

function Navbar(props) {
  const icon = auth().uid ? 'logout' : 'login';

  const handleLogoClick = () => {
    props.history.push('/');
  };

  const handleLoginBtn = () => {
    if (auth().uid) {
      auth().signOut(props.history);
    } else {
      props.history.push('/login');
    }
  };

  return (
    <Row style={{ color: '#FFF' }}>
      <Col span={12}>
        <Button type="link" style={{ color: '#FFF' }} onClick={handleLogoClick}>
          <span style={{ fontWeight: 'bolder' }}>STATSFY </span>
          {/* <span style={{ fontWeight: 'lighter' }}>{version}</span> */}
        </Button>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <Button type="link" style={{ color: '#FFF' }} onClick={handleLoginBtn}>
          <Icon type={icon} />
        </Button>
      </Col>
    </Row>
  );
}

Navbar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withRouter(Navbar);
