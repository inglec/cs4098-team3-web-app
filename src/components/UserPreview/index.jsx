import PropTypes from 'prop-types';
import React from 'react';

import TitleSubtitle from 'app-components/TitleSubtitle';

import './styles';

const UserPreview = ({ avatarUrl, name, uid }) => (
  <div className="userpreview">
    <img src={avatarUrl} alt={uid} />
    <TitleSubtitle subtitle={uid} title={name} />
  </div>
);

UserPreview.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
};

export default UserPreview;
