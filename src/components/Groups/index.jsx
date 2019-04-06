import PropTypes from 'prop-types';
import React from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import AddIcon from 'react-feather/dist/icons/plus-circle';
import RemoveIcon from 'react-feather/dist/icons/x-circle';

import SplitSelector from 'app-components/SplitSelector';
import TitleSubtitle from 'app-components/TitleSubtitle';
import UserPreview from 'app-components/UserPreview';

import './styles';

const renderGroupDetails = (selectedGroupId, groups, users, onAddPatient, onRemovePatient) => {
  const { groupName, users: groupPatients } = groups[selectedGroupId];

  return (
    <Form>
      <Form.Group>
        <Form.Label>Group ID</Form.Label>
        <Form.Control type="text" value={selectedGroupId} disabled />
      </Form.Group>
      <Form.Group>
        <Form.Label>Group Name</Form.Label>
        <Form.Control type="text" value={groupName} />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          Group Patients
          <button type="button" className="add-patient" onClick={onAddPatient}>
            <AddIcon />
          </button>
        </Form.Label>
        <ListGroup>
          {groupPatients.map((uid) => {
            const { avatarUrl, name } = users[uid];

            return (
              <ListGroup.Item key={uid} className="spacebetween">
                <UserPreview avatarUrl={avatarUrl} name={name} uid={uid} />
                <button
                  type="button"
                  className="remove-patient"
                  onClick={() => onRemovePatient(uid)}
                >
                  <RemoveIcon />
                </button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Form.Group>
    </Form>
  );
};

const Groups = (props) => {
  const {
    groups,
    onAddPatient,
    onRemovePatient,
    users,
  } = props;

  const renderContent = selectedGroupId => (
    renderGroupDetails(selectedGroupId, groups, users, onAddPatient, onRemovePatient)
  );

  const renderKey = groupId => (
    <TitleSubtitle>
      {groups[groupId].groupName}
      {groupId}
    </TitleSubtitle>
  );

  return (
    <div className="page groups">
      <div className="page-container">
        <SplitSelector
          keys={Object.keys(groups)}
          leftTitle="Groups"
          rightTitle="Group Details"
          renderContent={renderContent}
          renderKey={renderKey}
          unselectedMessage="Select a group to begin"
        />
      </div>
    </div>
  );
};

Groups.propTypes = {
  // FIXME
  groups: PropTypes.object.isRequired,

  // FIXME
  users: PropTypes.object.isRequired,

  onAddPatient: PropTypes.func,
  onRemovePatient: PropTypes.func,
};

Groups.defaultProps = {
  onAddPatient: uid => console.log('adding patient', uid),
  onRemovePatient: () => console.log('removing patient'),
};

export default Groups;
