import PropTypes from 'prop-types';
import React from 'react';

import './styles';

const IconedText = ({ children, icon: Icon }) => (
  <span className="iconedtext">
    <Icon className="iconedtext-icon" />
    {children}
  </span>
);

IconedText.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.func.isRequired,
};

export default IconedText;
