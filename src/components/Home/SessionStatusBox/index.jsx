import PropTypes from "prop-types";
import React from "react";
import { Redirect } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import './styles';

const activeImageSource = '../../../../data/test/live.png';
const reviewImageSource = '../../../../data/test/review.png';
const futureImageSource = '../../../../data/test/future.png';

const { Component } = React;

class SessionStatus extends Component {
  constructor(props) {
    super(props);
    this.renderSessionRedirect = () => <Redirect to="/session" />;
    this.state = {
      redirect: false,
    };
  }

  render() {
    const { session } = this.props;
    const { day, complete, active } = session;
    const goToSession = () => {
      this.setState({ redirect: true });
    };

    const { redirect } = this.state;

    const getSessionCardText = () => {
      let text = '';
      if (complete) {
        text = (
          <p>
            This session is over.
            <br />
            Click the button below to review.
          </p>
        );
      } else if (active) {
        text = (
          <p>
            Session is currently active.
            <br />
            Click the button below to join.
          </p>
        );
      } else {
        text = (
          <p>
            This session has not begun yet
            <br />
          </p>
        );
      }
      return text;
    };

    const getSessionButton = () => {
      let button = '';
      if (complete) {
        button = (
          <Button variant="primary">
            Review session
          </Button>
        );
      } else if (active) {
        button = (
          <Button variant="primary">
            Join session
          </Button>
        );
      }
      return button;
    };

    const getSessionCardImage = () => {
      let imageSource = '';
      if (complete) {
        imageSource = reviewImageSource;
      } else if (active) {
        imageSource = activeImageSource;
      } else {
        imageSource = futureImageSource;
      }
      return imageSource;
    };

    return (
      <div>
        {redirect && this.renderSessionRedirect()}
        <Card className="cards">
          <Card.Img className="cardImage" variant="top" src={getSessionCardImage()} />
          <Card.Text>
            <h2>{day}</h2>
            {getSessionCardText()}
            {getSessionButton()}
          </Card.Text>
        </Card>
        {}
      </div>
    );
  }
}
SessionStatus.propTypes = {
  uid: PropTypes.string.isRequired,
  session: PropTypes.objectOf(PropTypes.oneOf([PropTypes.string, PropTypes.bool])).isRequired,
};

export default SessionStatus;
