import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  Button,
} from 'antd';

import { Text } from './LanguageManager';

function QuizMain({ history }) {
  return (
    <Col xs={24} xl={12} style={{ marginTop: 10 }}>
      <Row type="flex" justify="center" align="middle">
        <Col span={24}>
          <Card title="Quiz">
            <Row type="flex" justify="center" align="middle">
              <Col span={24} style={{ height: '100%', textAlign: 'center' }}>
                <Button onClick={() => history.push('/quiz')} type="primary" size="large">
                  <Text dicio={{ pt: 'Fazer o Quiz Agora!', en: 'Make the Quiz Now!' }} />
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Col>
  );
}

QuizMain.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line
};

export default withRouter(QuizMain);
