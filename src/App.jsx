import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import moment from 'moment';

import 'moment/locale/pt-br';
import 'antd/dist/antd.css';

import {
  Login,
  Navbar,
  Main,
  GetCode,
  PrivateRoute,
} from './components';

const { Header } = Layout;

moment.locale('pt-br');

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header>
          <Navbar />
        </Header>
        <Switch>
          <PrivateRoute exact path="/" component={Main} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/code" component={GetCode} />
          {/* <Route path="/app" component={MainLogged} /> */}
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
