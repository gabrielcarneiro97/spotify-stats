import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import moment from 'moment';

import 'moment/locale/pt-br';
import 'antd/dist/antd.css';

import { LanguageProvider } from './components/LanguageManager';

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
            STATSFY ©2019 Created by Gabriel Carneiro
          </Footer>
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
