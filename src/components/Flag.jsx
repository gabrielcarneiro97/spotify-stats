import React from 'react';
import PropTypes from 'prop-types';

import 'flag-icon-css/css/flag-icon.min.css';

function Flag(props) {
  const { country } = props;

  const alp2 = country.toLowerCase();
  const className = `flag-icon flag-icon-${alp2}`;
  return <span className={className} />;
}

Flag.propTypes = {
  country: PropTypes.string,
};
Flag.defaultProps = {
  country: 'BR',
};

export default Flag;
