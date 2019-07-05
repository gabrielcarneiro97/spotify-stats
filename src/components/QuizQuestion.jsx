import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Row,
  Col,
  Radio,
} from 'antd';

import { rand } from '../services/num.service';
import { Text } from './LanguageManager';

function getIds(ansTp, optsNum, data) {
  const { genres } = data;
  let optsIds = new Set();

  if (ansTp === 'genres') {
    while (optsIds.size < optsNum) {
      optsIds.add(genres[rand(0, genres.length - 1)]);
    }
    optsIds = [...optsIds];
  } else {
    const keys = Object.keys(data[ansTp]);
    while (optsIds.size < optsNum) {
      optsIds.add(keys[rand(0, keys.length - 1)]);
    }
    optsIds = [...optsIds];
  }
  return optsIds;
}

class QuizQuestion extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired, // eslint-disable-line
    data: PropTypes.object.isRequired, // eslint-disable-line
    onAnswer: PropTypes.func.isRequired,
    num: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    const { data, question } = props;
    const ansTp = question.ansTp[rand(0, question.ansTp.length - 1)];
    const optsNum = 4;
    const optsIds = getIds(ansTp, optsNum, data);

    this.state = {
      optsIds, qsDicio: question.qs, ansTp,
    };
  }

  handleOptClick = ({ target }) => {
    const { value } = target;
    const { onAnswer } = this.props;
    const { ansTp } = this.state;
    onAnswer(value, ansTp);
  }

  createButtons = () => {
    const { data } = this.props;
    const { optsIds, ansTp } = this.state;

    const btns = optsIds.map((id) => {
      const btnStr = ansTp === 'genres' ? id.toUpperCase() : data[ansTp][id].name;
      return <Radio.Button key={id} value={id} style={{ width: '100%', margin: '5px' }}>{btnStr}</Radio.Button>;
    });

    return (
      <Fragment>
        <Radio.Group size="large" onChange={this.handleOptClick} style={{ marginTop: '1vh', width: '100%' }}>
          {btns}
        </Radio.Group>
      </Fragment>
    );
  }

  render() {
    const { qsDicio } = this.state;
    const { num } = this.props;
    const buttons = this.createButtons();
    return (
      <Card bordered={false} title={<Text dicio={{ pt: `Questão ${num}`, en: `Question ${num}` }} />} style={{ width: '100%', marginTop: '2vh' }}>
        <h3>
          <Text
            dicio={qsDicio}
          />
        </h3>
        {buttons}
      </Card>
    );
  }
}

export default QuizQuestion;
