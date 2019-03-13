import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import './styles';

const Profile = ({ profile, patientsPresent }) => (
  <div className="profile">

    <div className="profile-top">

      <Image className="profile-image" src={profile.imageSrc} roundedCircle fluid />
      <p className="profile-name">{profile.displayName}</p>
    </div>

    <div className="profile-bottom">

      <Card className="profile-card">
        <Card.Body className="card-item">

          <Card.Subtitle className="mb-2 text-muted card-item">
            Patient:
            {profile.uid}
            <DisplayBadge className="badge" profile={profile} patientsPresent={patientsPresent} />
          </Card.Subtitle>


          <Card.Text className="card-item">
            <ul>
              {
                  _.map(profile.medicalInfo, line => (
                    <li>{line}</li>
                  ))
              }
            </ul>
          </Card.Text>
          <Card.Link href="#">Contact</Card.Link>
          <Card.Link href="#">Medical Info.</Card.Link>
        </Card.Body>
      </Card>

    </div>


  </div>
);

// Oh how the linter made this so much logner than it needed to be
// Edit: Need to disable this 'react/jsx-one-expression-per-line', it follows up with
//  wanting me to then have a line for each brace, 5 lines per badge
const DisplayBadge = ({ profile, patientsPresent }) => {
  console.log(patientsPresent)
  if (!profile.present) {
    return (<Badge variant="warning">Missing</Badge>);
  }
  if (profile.ticks !== patientsPresent) {
    return (<Badge variant="info">Ticks: {profile.ticks} </Badge>);
  }
  return (null);
};


Profile.propTypes = {
  profile: PropTypes.object.isRequired, // <= go ahead, lint at me linter
  patientsPresent: PropTypes.number.isRequired,
};

DisplayBadge.propTypes = {
  profile: PropTypes.object.isRequired, // <= go ahead, lint at me linter (again)
  patientsPresent: PropTypes.number.isRequired,
};


export default Profile;
