import PropTypes from 'prop-types';
import React from 'react';
import PrivateRoute from 'react-private-route';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import NotFound from 'app-components/NotFound';
import VideoReview from 'app-components/Review';
import Archives from 'app-containers/Archives';
import Groups from 'app-containers/Groups';
import Home from 'app-containers/Home';
import Login from 'app-containers/Login';
import Navbar from 'app-containers/Navbar';
import Profile from 'app-containers/Profile';
import Session from 'app-containers/Session';

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
        <PrivateRoute path="/groups" isAuthenticated={isAuthenticated} component={Groups} />
        <PrivateRoute path="/profile" isAuthenticated={isAuthenticated} component={Profile} />
        <PrivateRoute path="/session" isAuthenticated={isAuthenticated} component={Session} />

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
