import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
// import { ReactiveVar } from 'meteor/reactive-var';
import sChat from 'meteor/schat:client-core';

class SChatBoxContained extends Component {
  constructor(props) {
    super(props);
  }

  renderWelcomeBoxMessage = () => {
    return (
      <div id="s-chat-box-welcome-message" className="s-chat-box-welcome-message s-chat-message-item">
        <div id="s-chat-box-welcome-avatar" className="s-chat-box-welcome-avatar s-chat-message-item-avatar" />
        <div id="s-chat-box-welcome-message-text" className="s-chat-box-welcome-message-text message">
          {sChat.settings.welcomeMessage}
        </div>
      </div>
    );
  }

  renderMessages = () => {
    return this.props.messages.map((m) => {
      const avatar = m.isFromClient ? <div className="s-chat-message-item-avatar" key="avatar" /> : null;
      return [
        avatar,
        <div key="message" className={'s-chat-message-item' + (m.isFromClient ? ' s-chat-message-item-client' : '')}>
          <div className="message">{m.msg}</div>
        </div>,
      ];
    });
  }

  render() {
    let className = 's-chat-box js-chat-box';
    if (this.props.adminStatus) {
      className += ' s-chat-box-admin-is-online';
    } else {
      className += ' s-chat-box-admin-is-offline';
    }

    return (
      <div id="s-chat-box" className={className}>
        <div id="s-chat-box-header" className="s-chat-box-header js-chat-box-close">
          <div className="s-chat-header-title">
            <span className="s-chat-presence-indicator" />
            {this.props.headerTitle}
          </div>
        </div>

        <div id="s-chat-messages" className="s-chat-messages js-chat-messages">
          {sChat.settings.welcomeMessage ? this.renderWelcomeBoxMessage() : null}
          {this.renderMessages()}
        </div>

        <textarea
          id="s-chat-submit-input"
          className={'s-chat-submit-input js-chat-submit-input' + (this.props.isIOS ? ' s-chat-submit-input-ios' : '')}
          rows="1"
          placeholder={sChat.settings.labels.sendPlaceholder}
        />
      </div>
    );
  }
}

SChatBoxContained.defaultProps = {
  headerTitle: 'Chat with us!',
};
SChatBoxContained.propTypes = {
  headerTitle: React.PropTypes.string,
  isIOS: React.PropTypes.bool,
  messages: React.PropTypes.array,
  adminStatus: React.PropTypes.string,
};

const SChatBox = createContainer(() => {
  const messages = sChat.messages;
  const adminStatus = sChat.adminStatusCurr;
  const isIOS = navigator.userAgent && navigator.userAgent.match(/iPhone|iPad|iPod/i);

  return {
    messages,
    adminStatus,
    isIOS,
  };
}, SChatBoxContained);
export default SChatBox;
