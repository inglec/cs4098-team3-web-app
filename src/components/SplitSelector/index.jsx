import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Scrollbar from 'react-perfect-scrollbar';

import './styles';

class SplitSelector extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { selected: '' };
  }

  setSelected(selected) {
    this.setState(state => ({ selected: state.selected === selected ? '' : selected }));
  }

  static renderPane(title, content, className = '') {
    return (
      <div className="splitselector-pane">
        <div className="splitselector-pane-container">
          <h5>{title}</h5>
          <Card className={`splitselector-pane-card ${className}`}>
            <Scrollbar>
              {content}
            </Scrollbar>
          </Card>
        </div>
      </div>
    );
  }

  renderLeftPane() {
    const { leftTitle, keys, renderKey } = this.props;
    const { selected } = this.state;

    const content = (
      <ListGroup>
        {
          keys.map(key => (
            <ListGroup.Item
              key={key}
              active={selected === key}
              onClick={() => this.setSelected(key)}
            >
              {renderKey(key)}
            </ListGroup.Item>
          ))
        }
      </ListGroup>
    );

    return this.constructor.renderPane(leftTitle, content, 'splitselector-left');
  }

  renderRightPane() {
    const { renderContent, rightTitle, unselectedMessage } = this.props;
    const { selected } = this.state;

    const content = (
      <Card.Body>
        {
          selected
            ? renderContent(selected)
            : <div className="splitselector-unselected">{unselectedMessage}</div>
        }
      </Card.Body>
    );

    return this.constructor.renderPane(rightTitle, content, 'splitselector-right');
  }

  render() {
    return (
      <div className="splitselector">
        <div className="splitselector-container">
          {this.renderLeftPane()}
          {this.renderRightPane()}
        </div>
      </div>
    );
  }
}

SplitSelector.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  leftTitle: PropTypes.string.isRequired,
  renderContent: PropTypes.func.isRequired,
  rightTitle: PropTypes.string.isRequired,

  renderKey: PropTypes.func,
  unselectedMessage: PropTypes.string,
};

SplitSelector.defaultProps = {
  renderKey: key => key,
  unselectedMessage: 'Select an item to begin',
};

export default SplitSelector;
