import React, { Component } from 'react';

export default class SChatBoxOpener extends Component {
  render() {
    const { isOpen, adminIsOnline, ...restProps } = this.props; // eslint-disable-line
    const className = 'opener' +
      (adminIsOnline ? ' online' : '') +
      (isOpen ? ' open' : '');

    return (
      <div
        {...restProps}
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
