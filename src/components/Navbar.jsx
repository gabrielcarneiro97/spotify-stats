/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';

import { auth } from '../services/auth.service';

function Navbar(props) {
  const icon = auth().uid ? 'logout' : 'login';

  const handleClick = () => {
    if (auth().uid) {
      auth().signOut(props.history);
    } else {
      props.history.push('/login');
    }
  };

  return (
    <Row style={{ color: '#FFF' }}>
      <Col span={12}>
        <a style={{ color: '#FFF' }}>
          <span style={{ fontWeight: 'bolder' }}>STATSFY </span>
          {/* <span style={{ fontWeight: 'lighter' }}>{version}</span> */}
        </a>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <a className="login-btn" onClick={handleClick}>
          <Icon type={icon} />
        </a>
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
