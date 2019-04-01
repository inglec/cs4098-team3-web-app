import PropTypes from 'prop-types';

// User types
export const ADMIN = 'admin';
export const MOTIVATOR = 'motivator';
export const PATIENT = 'patient';

export const userPropTypes = {
  avatarUrl: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  userType: PropTypes.oneOf([ADMIN, MOTIVATOR, PATIENT]),
};
