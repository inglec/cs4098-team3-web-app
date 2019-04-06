import PropTypes from 'prop-types';
import React from 'react';

import './styles';

const TitleSubtitle = ({ children }) => {
  const title = children[0];
  const subtitle = children[1];

  return (
    <div className="title-subtitle">
      <span>{title}</span>
      <span className="subtitle">{subtitle}</span>
    </div>
  );
};

TitleSubtitle.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default TitleSubtitle;
