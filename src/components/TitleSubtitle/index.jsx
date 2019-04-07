import PropTypes from 'prop-types';
import React from 'react';

import './styles';

const TitleSubtitle = ({ subtitle, title }) => (
  <div className="title-subtitle">
    <span>{title}</span>
    <span className="subtitle">{subtitle}</span>
  </div>
);

TitleSubtitle.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node.isRequired,
};

export default TitleSubtitle;
