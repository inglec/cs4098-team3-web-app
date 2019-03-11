import React from 'react';

import { Link } from 'react-router-dom';

import './styles';

const NotFound = () => (
  <div className="page notfound">
    <div className="notfound-container">
      <div className="message">
        <h1>404: Not Found</h1>
        <h5>The page you are requesting does not exist</h5>
      </div>
      <Link to="/">Return home</Link>
    </div>
  </div>
);

export default NotFound;
