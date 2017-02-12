import React, { Component } from 'react';
// import { createContainer } from 'meteor/react-meteor-data';
// import sChat from 'meteor/schat:client-core';

export default class SChatBoxOpenerContained extends Component {
  render() {
    const { isOpen, adminIsOnline, ...restProps } = this.props; // eslint-disable-line
    let className = 's-chat-box-opener js-chat-box-open';
    if (isOpen) className += ' hidden';
    if (adminIsOnline) className += ' admin-online';

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
  adminIsOnline: React.PropTypes.bool,
};
