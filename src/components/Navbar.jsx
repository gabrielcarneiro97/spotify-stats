/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Icon } from 'antd';
import PropTypes from 'prop-types';

function Navbar() {
  const handleClick = () => console.log('click');

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
          <Icon type="login" />
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
