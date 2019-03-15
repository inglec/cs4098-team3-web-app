import PropTypes from 'prop-types';
import React from 'react';
import PrivateRoute from 'react-private-route';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import uuidv4 from 'uuid/v4';

import Archives from 'app-components/Archives';
import NotFound from 'app-components/NotFound';
import Profile from 'app-components/Profile';
import Home from 'app-containers/Home';
import Login from 'app-containers/Login';
import Navbar from 'app-containers/Navbar';
import Session from 'app-containers/Session';
import VideoReview from 'app-components/Review';

import { urls } from 'app-root/src/config';

import './styles';

const App = ({ isAuthenticated }) => (
  <BrowserRouter>
    <div id="app">
      <Switch>
        <Navbar />
      </Switch>
      <Switch>
        { /* Public routes which don't require authentication. */ }
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />

        { /* Temporary route for testing purposes, need to decide how to get to here */}
        <Route path="/review" component={VideoReview} />

        { /* Private routes which require authentication. */ }
        <PrivateRoute path="/archives" isAuthenticated={isAuthenticated} component={Archives} />
        <PrivateRoute path="/profile" isAuthenticated={isAuthenticated} component={Profile} />
        <PrivateRoute
          path="/session"
          isAuthenticated={isAuthenticated}
          component={Session}
          uid={uuidv4()} // TODO: Not working, redux mapStateto props is overiding this anyway
          url={urls.remote} // TODO: Change
        />

        { /* Catch unmatched paths and serve 404 component. */ }
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>
);

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default App;
