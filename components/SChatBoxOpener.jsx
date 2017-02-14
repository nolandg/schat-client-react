import React, { Component } from 'react';

export default class SChatBoxOpener extends Component {
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

SChatBoxOpener.defaultProps = {

};
SChatBoxOpener.propTypes = {
  isOpen: React.PropTypes.bool,
  adminIsOnline: React.PropTypes.bool,
};
