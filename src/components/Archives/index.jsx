import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import CheckIcon from 'react-feather/dist/icons/check-circle';

import SplitSelector from 'app-components/SplitSelector';
import TitleSubtitle from 'app-components/TitleSubtitle';
import UserPreview from 'app-components/UserPreview';

import './styles';

const formatDate = time => moment(time).format('ddd, Do MMM YYYY, HH:mm:ss');

const renderSessionId = (sessionId, sessions, userType) => {
  const { review, startTime } = sessions[sessionId];

  const status = userType === 'admin' && review
    ? <Badge variant="success" className="reviewed">reviewed</Badge>
    : null;

  const startTimeString = formatDate(startTime);

  return (
    <span>
      <TitleSubtitle subtitle={startTimeString} title={sessionId} />
      {status}
    </span>
  );
};

const renderSelectedSession = (selectedSession, groups, user, users, history) => {
  const {
    attendance = {},
    endTime,
    groupId,
    review = {},
    startTime,
  } = selectedSession;

  const startTimeString = formatDate(startTime);
  const endTimeString = formatDate(endTime);

  const duration = moment.duration(endTime - startTime);
  const hours = duration.hours();
  const minutes = duration.minutes();
  const durationString = `${hours ? `${hours}hr ` : ''}${minutes}m`;

  const { users: groupUsers } = groups[groupId];
  const confirmed = review.confirmed || [];
  const isAdmin = user.userType === 'admin';

  return (
    <Form>
      <Form.Group>
        <Form.Label>Start time</Form.Label>
        <Form.Control type="text" value={startTimeString} disabled />
      </Form.Group>
      <Form.Group>
        <Form.Label>End time</Form.Label>
        <Form.Control type="text" value={endTimeString} disabled />
      </Form.Group>
      <Form.Group>
        <Form.Label>Duration</Form.Label>
        <Form.Control type="text" value={durationString} disabled />
      </Form.Group>
      <Form.Group>
        <Form.Label>{isAdmin ? 'Review' : 'Attendance' }</Form.Label>
        <ListGroup>
          {
            groupUsers.map((uid) => {
              const { avatarUrl, name } = users[uid];

              return (
                <ListGroup.Item key={uid} disabled={!Object.keys(attendance).includes(uid)}>
                  <UserPreview avatarUrl={avatarUrl} name={name} uid={uid} />
                  {isAdmin && confirmed.includes(uid) ? <CheckIcon className="confirmed" /> : null}
                </ListGroup.Item>
              );
            })
          }
        </ListGroup>
      </Form.Group>
      {
        isAdmin
          ? (
            <Button
              block
              size="md"
              variant="outline-primary"
              onClick={() => history.push('/review')}
            >
              View Session Archive
            </Button>
          )
          : null
      }
    </Form>
  );
};

const Archives = (props) => {
  const {
    groups,
    history,
    sessions,
    user,
    users,
  } = props;

  return (
    <div className="page archives">
      <div className="page-container">
        <SplitSelector
          keys={Object.keys(sessions)}
          leftTitle="Archived Sessions"
          renderContent={
            selected => renderSelectedSession(sessions[selected], groups, user, users, history)
          }
          renderKey={key => renderSessionId(key, sessions, user.userType)}
          rightTitle="Session Information"
          unselectedMessage="Select a session from the left-hand pane to begin"
        />
      </div>
    </div>
  );
};

// TODO: Make required
Archives.propTypes = {
  // FIXME
  groups: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  // FIXME
  sessions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

export default Archives;
