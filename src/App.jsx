import React from 'react';
import { Layout, Row, Col } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import moment from 'moment';

import 'moment/locale/pt-br';

import { LanguageProvider, LanguageSelect } from './components/LanguageManager';

import {
  Login,
  Navbar,
  Main,
  GetCode,
  PrivateRoute,
  TracksDetails,
  ArtistsDetails,
  Quiz,
} from './components';

const { Header, Footer } = Layout;

moment.locale('pt-br');


function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Layout>
          <Header>
            <Navbar />
          </Header>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/code" component={GetCode} />
            <PrivateRoute exact path="/" component={Main} />
            <PrivateRoute exact path="/tracks" component={TracksDetails} />
            <PrivateRoute exact path="/artists" component={ArtistsDetails} />
            <PrivateRoute exact path="/quiz" component={Quiz} />
          </Switch>
          <Footer
            style={{
              textAlign: 'center',
              backgroundColor: '#001529',
              color: '#FFF',
              marginTop: 5,
            }}
          >
            <Row>
              <Col span={12} style={{ textAlign: 'end' }}>
                STATSFY ©2019 Created by Gabriel Carneiro
              </Col>
              <Col span={12} style={{ textAlign: 'end' }}>
                <LanguageSelect />
              </Col>
            </Row>
          </Footer>
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
