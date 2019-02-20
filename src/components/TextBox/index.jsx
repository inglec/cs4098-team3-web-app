import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './styles';

class TextBox extends Component {
  constructor(props) {
    super(props);

    this.state = { text: '' };
  }

  onTextChange(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    const { text } = this.state;
    const { buttonLabel, onSubmit } = this.props;

    return (
      <div className="textbox">
        <input type="text" onChange={event => this.onTextChange(event)} />
        <button type="button" onClick={() => onSubmit(text)}>{buttonLabel}</button>
      </div>
    );
  }
}

TextBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,

  buttonLabel: PropTypes.string,
};

TextBox.defaultProps = {
  buttonLabel: 'Submit',
};

export default TextBox;
