import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';
// import sChat from 'meteor/schat:client-core';

export default class SChatBoxOpenerContained extends Component {
  render() {
    const { isOpen, ...restProps } = this.props; // eslint-disable-line
    let className = 's-chat-box-opener js-chat-box-open';
    if (this.props.isOpen) className += ' hidden';

    return (
      <div
        {...restProps}
        id="s-chat-box-opener"
        className={className}
      />
    );
  }
}

SChatBoxOpenerContained.defaultProps = {

};
SChatBoxOpenerContained.propTypes = {
  isOpen: React.PropTypes.bool,
};
