import React from 'react';
import PropTypes from 'prop-types';

import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';

import './styles';

const isNurse = true;

const Profile = ({ profile, peoplePresent }) => (
  <div className="review-profile">
    <div className="review-profile-top">
      <Image className="review-profile-image" src={profile.imageSrc} roundedCircle fluid />
      <div className="review-profile-side-text">
        <p className="review-profile-name">{profile.displayName}</p>
        <Card.Subtitle className="mb-2 text-muted">
          <SubtitleText profile={profile} peoplePresent={peoplePresent} />
        </Card.Subtitle>
      </div>
    </div>
    <div className="review-profile-bottom">
      <Card className="review-profile-card">
        <Card.Body className="review-profile-card-body">
          <Card.Link href="#">Contact</Card.Link>
          <Card.Link href="#">Profile</Card.Link>
          {isNurse ? <Card.Link href="#">Medical Info.</Card.Link> : null}
        </Card.Body>
      </Card>
    </div>
  </div>
);


const SubtitleText = ({ profile, peoplePresent }) => {
  if (!profile.present) {
    return <p>Note: absent</p>;
  }
  if (profile.ticks !== peoplePresent) {
    return (
      <p>
        Note: ticks
        {' '}
        <b>{profile.ticks}</b>
      </p>
    );
  }
  return null;
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired, // <= go ahead, lint at me linter
  peoplePresent: PropTypes.number.isRequired,
};

SubtitleText.propTypes = {
  profile: PropTypes.object.isRequired, // <= go ahead, lint at me linter
  peoplePresent: PropTypes.number.isRequired,
};


export default Profile;
