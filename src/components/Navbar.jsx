import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Row,
  Col,
  Button,
} from 'antd';
import PropTypes from 'prop-types';

import './Navbar.css';

import { Text } from './LanguageManager';

import { version } from '../../package.json';
import { auth } from '../services/auth.service';

function Navbar(props) {
  const btnText = auth().uid ? <Text dicio={{ pt: 'SAIR', en: 'LOGOUT' }} /> : <Text dicio={{ pt: 'ENTRAR', en: 'LOGIN' }} />;

  const handleLogoClick = () => {
    props.history.push('/');
  };

  const handleLoginBtn = () => {
    if (auth().uid) {
      auth().signOut(props.history);
      props.history.push('/login');
    }
  };

  return (
    <Row>
      <Col span={12}>
        <Button type="link" onClick={handleLogoClick}>
          <span style={{ fontWeight: 'bolder' }}>STATSFY&nbsp;</span>
          <span style={{ fontWeight: 'lighter' }}>{version}</span>
        </Button>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <Button type="ghost" onClick={handleLoginBtn} id="login-btn">
          {btnText}
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
