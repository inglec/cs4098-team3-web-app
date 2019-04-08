import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

class TextBox extends Component {
  constructor(props) {
    super(props);

    this.inputRef = null;
    this.keyboardListener = event => this.onKeyPressed(event);
    this.state = { text: '' };
  }

  componentWillUnmount() {
    this.removeKeyboardListener();
  }

  onKeyPressed({ key }) {
    // Check if input text box is selected
    const isInputActive = document.activeElement === this.inputRef;

    if (isInputActive && key === 'Enter') {
      this.onClickSubmit();
    }
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

  setInputRef(ref) {
    // Remove listener from old ref
    this.removeKeyboardListener();
    this.inputRef = ref;

    // Add listener to new ref
    this.addKeyboardListener();
  }

  addKeyboardListener() {
    if (this.inputRef) {
      this.inputRef.addEventListener('keydown', this.keyboardListener);
    }
  }

  removeKeyboardListener() {
    if (this.inputRef) {
      this.inputRef.removeEventListener('keydown', this.keyboardListener);
    }
  }

  render() {
    const { text } = this.state;
    const { children, placeholder } = this.props;

    return (
      <InputGroup className="textbox">
        <FormControl
          as="input"
          placeholder={placeholder}
          value={text}
          onChange={event => this.onTextChange(event)}
          ref={ref => this.setInputRef(ref)}
        />
        <InputGroup.Append>
          <Button
            variant="outline-primary"
            disabled={!text}
            onClick={() => this.onClickSubmit()}
          >
            {children}
          </Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

TextBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,

  children: PropTypes.node,
  placeholder: PropTypes.string,
};

TextBox.defaultProps = {
  children: 'Submit',
  placeholder: 'Enter text',
};

export default TextBox;
