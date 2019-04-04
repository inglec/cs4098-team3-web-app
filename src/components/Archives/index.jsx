import { map } from 'lodash/collection';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import CheckIcon from 'react-feather/dist/icons/check-circle';
import Scrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import './styles';

class Archives extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSessionId: '',
    };
  }

  setSelectedSession(sessionId) {
    // Deselect session ID if already selected
    this.setState(({ selectedSessionId }) => ({
      selectedSessionId: selectedSessionId === sessionId ? '' : sessionId,
    }));
  }

  renderSessionList() {
    const { sessions } = this.props;
    const { selectedSessionId } = this.state;

    return (
      <ListGroup>
        {
          map(sessions, (session, sessionId) => {
            const status = sessions[sessionId].review
              ? <Badge variant="success" className="status">reviewed</Badge>
              : null;

            return (
              <ListGroup.Item
                key={sessionId}
                active={selectedSessionId === sessionId}
                onClick={() => this.setSelectedSession(sessionId)}
              >
                {sessionId}
                {status}
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
    );
  }

  renderSelectedSession() {
    const { groups, history, sessions } = this.props;
    const { selectedSessionId } = this.state;
    const selectedSession = sessions[selectedSessionId];

    if (!selectedSession) {
      return <div className="unselected">Select a session from the left-hand pane to begin</div>;
    }

    const {
      attendance = {},
      endTime,
      groupId,
      review = {},
      startTime,
    } = selectedSession;

    const formatDate = time => moment(time).format('ddd, Do MMM YYYY, HH:mm:ss');
    const startTimeString = formatDate(startTime);
    const endTimeString = formatDate(endTime);

    const duration = moment.duration(endTime - startTime);
    const hours = duration.hours();
    const minutes = duration.minutes();
    const durationString = `${hours ? `${hours}hr ` : ''}${minutes}m`;

    const { users } = groups[groupId];
    const confirmed = review.confirmed || [];

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
          <Form.Label>Review</Form.Label>
          <ListGroup>
            {
              users.map(user => (
                <ListGroup.Item key={user} disabled={!Object.keys(attendance).includes(user)}>
                  {user}
                  {confirmed.includes(user) ? <CheckIcon className="icon" /> : null}
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </Form.Group>
        <Button
          block
          size="md"
          variant="outline-primary"
          onClick={() => history.push('/review')}
        >
          View Session Archive
        </Button>
      </Form>
    );
  }

  render() {
    return (
      <div className="page archives">
        <div className="page-container">
          <div className="archives-container">
            <div className="archives-col">
              <h5>Archived Sessions</h5>
              <Card>
                <Scrollbar>
                  {this.renderSessionList()}
                </Scrollbar>
              </Card>
            </div>
            <div className="archives-col">
              <h5>Session Information</h5>
              <Card>
                <Scrollbar>
                  <Card.Body>
                    {this.renderSelectedSession()}
                  </Card.Body>
                </Scrollbar>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// TODO: Make required
Archives.propTypes = {
  // FIXME
  groups: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  // FIXME
  sessions: PropTypes.object.isRequired,
};

export default Archives;
