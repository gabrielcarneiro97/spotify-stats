import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Card } from 'antd';


import { rand } from '../services/num.service';
import { getTop } from '../services/api.service';
import { Text } from './LanguageManager';

import QuizQuestion from './QuizQuestion';

const allQuestions = require('../assets/quiz-questions.json');

const qNum = allQuestions.length - 1;

// pergunta vazia para o JSON
// {
//   "qs": {
//     "pt": "",
//     "en": ""
//   },
//   "ansTp": []
// }

class QuizGame extends Component {
  static propTypes = {
    onEnd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const quizSize = 5;
    let qsNums = new Set();

    while (qsNums.size < quizSize) {
      qsNums.add(rand(0, qNum));
    }

    qsNums = [...qsNums];
    const questions = qsNums.map(num => allQuestions[num]);

    this.state = {
      answers: {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
      },
      done: false,
      questions,
    };
  }

  async componentWillMount() {
    const data = await getTop();

    this.setState({ data });
  }

  handleAnswer = qsId => (id, ansTp) => {
    const { answers } = this.state;

    answers[qsId] = {
      id, ansTp,
    };

    this.setState({ answers }, () => {
      const { answers: answersNow } = this.state;
      const done = !Object.keys(answersNow).find(k => !answersNow[k].id);
      if (done) this.setState({ done });
    });
  }

  onEnd = () => {
    const { onEnd } = this.props;
    const { answers } = this.state;

    onEnd(answers);
  }

  defineRender = () => {
    const { data, questions, done } = this.state;

    if (!data) return <Card loading />;

    return (
      <Card title="Quiz">
        <Row>
          {questions.map((q, i) => <QuizQuestion data={data} num={i + 1} key={`${i + 1}-question`} question={q} onAnswer={this.handleAnswer(i + 1)} />)}
        </Row>
        <Row type="flex" justify="end" align="middle">
          <Button type="primary" size="large" disabled={!done} onClick={this.onEnd}>
            <Text dicio={{ pt: 'Enviar', en: 'Send' }} />
          </Button>
        </Row>
      </Card>
    );
  }

  render() {
    return (
      <Row type="flex" justify="center" align="middle" style={{ marginTop: '10vh', marginBottom: '10vh' }}>
        <Col xs={24} md={12}>
          {this.defineRender()}
        </Col>
      </Row>
    );
  }
}

export default QuizGame;
