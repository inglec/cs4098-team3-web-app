import { pick } from 'lodash/object';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { userPropTypes } from 'app-proptypes/sql';

import './styles';

class Profile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      fields: pick(props, 'avatarUrl', 'bio', 'email', 'phone'),
    };
  }

  resetFields() {
    const fields = pick(this.props, 'avatarUrl', 'bio', 'email', 'phone');

    this.setState({ fields });
  }

  renderField(key, name, isEnabled, permanentValue, inputType = 'input') {
    const { fields } = this.state;
    const value = permanentValue || fields[key];

    const onChange = ({ target }) => {
      const { value: newValue } = target;

      this.setState(state => ({
        fields: {
          ...state.fields,
          [key]: newValue,
        },
      }));
    };

    return (
      <Form.Group>
        <Form.Label>{name}</Form.Label>
        <Form.Control
          value={value}
          as={inputType}
          disabled={!isEnabled}
          onChange={onChange}
          rows="8"
        />
      </Form.Group>
    );
  }

  renderButtons() {
    const { isEditing } = this.state;
    const { onUpdateProfile, token } = this.props;

    // Render "cancel" and "update" buttons
    if (isEditing) {
      const onClickCancel = () => {
        this.resetFields();
        this.setState({ isEditing: false });
      };

      const onClickUpdate = () => {
        const { fields } = this.state;
        onUpdateProfile(token, fields);
        this.setState({ isEditing: false });
      };

      return (
        <div className="profile-buttons">
          <Button
            type="button"
            variant="secondary"
            onClick={onClickCancel}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onClickUpdate}>Update Profile</Button>
        </div>
      );
    }

    // Render "edit" button
    return (
      <Button
        type="button"
        variant="primary"
        onClick={() => this.setState({ isEditing: true })}
      >
        Edit Profile
      </Button>
    );
  }

  render() {
    const { isEditing, fields } = this.state;
    const { name, uid } = this.props;
    const { avatarUrl } = fields;

    return (
      <div className="page profile">
        <div className="page-container">
          <div className="profile-container">
            <h1>My Profile</h1>
            <Form className="profile-form">
              <div className="profile-uneditable-container">
                <div className="profile-uneditable">
                  {this.renderField('name', 'Name', false, name)}
                  {this.renderField('uid', 'User ID', false, uid)}
                </div>
                <div className="profile-avatar">
                  <img src={avatarUrl} alt={name || uid} />
                </div>
              </div>
              {this.renderField('avatarUrl', 'Profile Picture URL', isEditing)}
              {this.renderField('bio', 'Bio', isEditing, null, 'textarea')}

              <h3>Contact Information</h3>
              {this.renderField('email', 'Email', isEditing)}
              {this.renderField('phone', 'Phone number', isEditing)}

              {this.renderButtons()}
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  ...userPropTypes,
  onUpdateProfile: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default Profile;
