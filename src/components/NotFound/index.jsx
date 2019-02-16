import React from 'react';

import { Link } from 'react-router-dom';

import './styles';

const NotFound = () => (
  <div className="centered">
    <div className="centered">
      <h1>404: Not Found</h1>
      <p>The page you are requesting does not exist.</p>
    </div>
    <Link to="/">Return to the home page</Link>
  </div>
);

export default NotFound;
