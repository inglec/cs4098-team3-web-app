import React from 'react';

const Profile = ({ profile }) => (
  <div className="profile">
    <p>I am {profile.displayName}</p>
  </div>
);

export default Profile;
