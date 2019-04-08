/* eslint-disable jsx-a11y/media-has-caption */

import { map } from 'lodash/collection';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

import Chat from 'app-components/Chat';

import './styles';

const renderTimestamp = (text, timestamp) => (
  <div>
    {text}
    <Badge pill variant="light">{moment(timestamp).format('HH:mm:ss')}</Badge>
  </div>
);

const renderAttendance = (attendance, users) => (
  <div className="review-attendance">
    {
      map(attendance, ({ joinedAt, leftAt }, uid) => {
        const { avatarUrl, name } = users[uid];

        return (
          <Card key={uid}>
            <Card.Body>
              <img src={avatarUrl} alt={uid} />
              <Card.Title>{name}</Card.Title>
              {renderTimestamp('Joined at', joinedAt)}
              {renderTimestamp('Left at', leftAt)}
            </Card.Body>
          </Card>
        );
      })
    }
  </div>
);

const Review = ({ chat, session, users }) => {
  const { archiveUrl, attendance } = session;

  return (
    <div className="page review">
      <div className="review-main">
        <div className="review-video">
          <video controls>
            <source src={archiveUrl} type="video/mp4" />
          </video>
        </div>
        {renderAttendance(attendance, users)}
      </div>
      <Chat messages={chat} userUids={Object.keys(session.attendance)} />
    </div>
  );
};

Review.propTypes = {
  session: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,

  chat: PropTypes.array,
};

Review.defaultProps = {
  chat: [],
};

export default Review;
