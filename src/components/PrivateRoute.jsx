import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { auth } from '../services/auth.service';

function PrivateRoute(props) {
  const { component: Component, ...rest } = props;
  const toRender = propsRender => (
    auth().uid
      ? <Component {...propsRender} />
      : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: propsRender.location },
          }}
        />
      )
  );

  return <Route {...rest} render={toRender} />;
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

export default PrivateRoute;
