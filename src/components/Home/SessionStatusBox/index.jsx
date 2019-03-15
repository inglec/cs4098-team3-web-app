import PropTypes from 'prop-types';
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './styles';

const activeImageSource = '../../../../data/test/live.png';
const reviewImageSource = '../../../../data/test/review.png';
const futureImageSource = '../../../../data/test/future.png';

const SessionBox = ({ session, push, path }) => {
  const { day, complete, active } = session;

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
        <Button variant="primary" onClick={() => push(path)}>
          Review session
        </Button>
      );
    } else if (active) {
      button = (
        <Button variant="primary" onClick={() => push(path)}>
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
};

SessionBox.propTypes = {
  session: PropTypes.objectOf(PropTypes.oneOf([PropTypes.string, PropTypes.bool])).isRequired,
  push: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
};

export default SessionBox;
