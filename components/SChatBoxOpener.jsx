import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import sChat from 'meteor/schat:client-core';

class SChatBoxOpenerContained extends Component {
  render() {
    return (
      <div
        id="s-chat-box-opener"
        className="s-chat-box-opener js-chat-box-open"
      />
    );
  }
}

SChatBoxOpenerContained.defaultProps = {

};
SChatBoxOpenerContained.propTypes = {
  isIOS: React.PropTypes.bool,
  messages: React.PropTypes.array,
  adminStatus: React.PropTypes.string,
};

const SChatBoxOpener = createContainer(() => {
  const messages = sChat.messages;
  const adminStatus = sChat.adminStatusCurr;
  const isIOS = navigator.userAgent && navigator.userAgent.match(/iPhone|iPad|iPod/i);

  return {
    messages,
    adminStatus,
    isIOS,
  };
}, SChatBoxOpenerContained);
export default SChatBoxOpener;
