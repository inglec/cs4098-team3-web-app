import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import './styles';

const isNurse = true;

const Profile = ({ profile, peoplePresent }) => (
  <div className="profile">

    <div className="profile-top">

      <Image className="profile-image" src={profile.imageSrc} roundedCircle fluid />
      <div className="profile-side-text">

        <p className="profile-name">{profile.displayName}</p>

        <Card.Subtitle className="mb-2 text-muted">
          <SubtitleText profile={profile} peoplePresent={peoplePresent} />
        </Card.Subtitle>

      </div>


    </div>

    <div className="profile-bottom">

      <Card className="profile-card">
        <Card.Body className="profile-card-body">
          <Card.Link href="#">Contact</Card.Link>
          <Card.Link href="#">Profile</Card.Link>
          {
            isNurse && <Card.Link href="#">Medical Info.</Card.Link>
          }
        </Card.Body>
      </Card>

    </div>


  </div>
);


const SubtitleText = ({ profile, peoplePresent }) => {
  console.log(peoplePresent)
  if (!profile.present) {
    return (<p>absent</p>);
  }
  if (profile.ticks !== peoplePresent) {
    return (<p>ticks: <i>{profile.ticks}</i></p>);
  }
  return (null);
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
