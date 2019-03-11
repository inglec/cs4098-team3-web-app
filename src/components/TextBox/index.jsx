import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

class TextBox extends Component {
  constructor(props) {
    super(props);

    this.state = { text: '' };
  }

  onTextChange(event) {
    this.setState({ text: event.target.value });
  }

  onClickSubmit() {
    const { text } = this.state;
    const { onSubmit } = this.props;

    onSubmit(text);
    this.setState({ text: '' });
  }

  render() {
    const { text } = this.state;
    const { buttonLabel, placeholder } = this.props;

    return (
      <InputGroup className="textbox">
        <FormControl
          as="input"
          placeholder={placeholder}
          onChange={event => this.onTextChange(event)}
          value={text}
        />
        <InputGroup.Append>
          <Button
            variant="outline-primary"
            disabled={!text}
            onClick={() => this.onClickSubmit()}
          >
            {buttonLabel}
          </Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

TextBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,

  buttonLabel: PropTypes.string,
  placeholder: PropTypes.string,
};

TextBox.defaultProps = {
  buttonLabel: 'Submit',
  placeholder: 'Enter text',
};

export default TextBox;
