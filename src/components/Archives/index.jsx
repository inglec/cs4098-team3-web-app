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
import XIcon from 'react-feather/dist/icons/x-circle';
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
    this.setState({ selectedSessionId: sessionId });
  }

  renderSessionList() {
    const { sessions } = this.props;
    const { selectedSessionId } = this.state;

    return (
      <ListGroup>
        {
          map(sessions, (session, sessionId) => {
            const status = sessions[sessionId].wasReviewed
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
    const { group: { members }, history, sessions } = this.props;
    const { selectedSessionId } = this.state;
    const selectedSession = sessions[selectedSessionId];

    if (!selectedSession) {
      return <div className="unselected">Select a session from the left-hand pane to begin</div>;
    }

    const formatDate = time => moment(time).format('ddd, Do MMM YYYY, HH:mm:ss');

    const startTime = formatDate(selectedSession.startTime);
    const endTime = formatDate(selectedSession.endTime);
    const duration = moment.duration(selectedSession.endTime - selectedSession.startTime).minutes();

    return (
      <Form>
        <Form.Group>
          <Form.Label>Start time</Form.Label>
          <Form.Control type="text" value={startTime} disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>End time</Form.Label>
          <Form.Control type="text" value={endTime} disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>Duration</Form.Label>
          <Form.Control type="text" value={`${duration} minutes`} disabled />
        </Form.Group>
        <Form.Group>
          <Form.Label>User attendance</Form.Label>
          <ListGroup>
            {
              members.map((member) => {
                const icon = selectedSession.users.includes(member)
                  ? <CheckIcon className="icon check" />
                  : <XIcon className="icon x" />;

                return (
                  <ListGroup.Item key={member}>
                    {icon}
                    {member}
                  </ListGroup.Item>
                );
              })
            }
          </ListGroup>
        </Form.Group>
        <Button onClick={() => history.push('/review')}>View Session Archive</Button>
      </Form>
    );
  }

  render() {
    return (
      <div className="page archives">
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
    );
  }
}

// TODO: Make required
Archives.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,

  group: PropTypes.exact({
    admin: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  sessions: PropTypes.objectOf(
    PropTypes.exact({
      endTime: PropTypes.number.isRequired,
      startTime: PropTypes.number.isRequired,
      users: PropTypes.arrayOf(PropTypes.string).isRequired,
      wasReviewed: PropTypes.bool.isRequired,
    }),
  ),
};

// TODO: Remove
Archives.defaultProps = {
  group: {
    admin: 'admin',
    members: [
      'alex',
      'chris',
      'ciaran',
      'conal',
      'conor',
      'eddie',
    ],
  },
  sessions: (() => {
    const object = {};
    for (let i = 20; i > 0; i -= 1) {
      object[`session${i}`] = {
        users: ['ciaran', 'eddie', 'conal'],
        startTime: new Date().getTime() - Math.floor(Math.random() * 1000000),
        endTime: new Date().getTime(),
        wasReviewed: Math.random() < 0.7,
      };
    }
    return object;
  })(),
};

export default Archives;
