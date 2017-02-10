import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import sChat from 'meteor/schat:client-core';
import SChatBoxOpener from './SChatBoxOpener';

if (Meteor.isClient) {
  Meteor.startup(() => {
    sChat.init('BLg9Ndgj58tXPMQFY', {
      ssl: false,
      welcomeMessage: 'Hi, how can I help you?',
      hostName: 'localhost:3042',
      labels: {
        sendPlaceholder: 'Send the message...',
        headerTitle: 'Welcome on my website!',
      },
    });
  });
}

class SChatBoxContained extends Component {
  constructor(props) {
    super(props);

    // Can't figure out how to make this isomophic to not screw up the SSR
    // const isIOS = navigator.userAgent && navigator.userAgent.match(/iPhone|iPad|iPod/i);
    this.isIOS = false;

    this.state = {
      isOpen: false,
      message: '',
    };
  }

  componentDidMount = () => {

  }

  handleOpenerClick = () => {
    this.setState({ isOpen: true });
    // Meteor.setTimeout(() => {
    //   tmpl.find('.s-chat-submit-input').focus();
    // }, 0);
  }
  handleCloseClick = () => {
    this.setState({ isOpen: false });
  }

  handleKeyDown = (event) => {
    if (event.keyCode !== 13) return;
    console.log(this.state.message);
    if (!this.state.message.trim()) return;

    event.preventDefault();
    sChat.ddp.call(
      'addChatMessage',
      this.state.message,
      sChat.clientAppId,
      sChat.userSessionId,
      true // is from client
    );

    this.setState({ message: '' });
    // const messages = $(e.currentTarget).closest('.js-chat-box').find('.js-chat-messages')[0];
    // messages.scrollTop = messages.scrollHeight;
    // $(messages).outerHeight(tmpl.messagesInitSize);
  }

  handleChange = (event) => {
    this.setState({ message: event.target.value });
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
    if (this.props.adminIsOnline) {
      className += ' s-chat-box-admin-is-online';
    } else {
      className += ' s-chat-box-admin-is-offline';
    }
    if (this.state.isOpen) {
      className += ' opened';
    } else {
      className += ' hidden';
    }

    return (
      <div>
        <div id="s-chat-box" className={className}>
          <div id="s-chat-box-header" className="s-chat-box-header js-chat-box-close" onClick={this.handleCloseClick}>
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
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            value={this.state.value}
            id="s-chat-submit-input"
            className={'s-chat-submit-input js-chat-submit-input' + (this.isIOS ? ' s-chat-submit-input-ios' : '')}
            rows="1"
            placeholder={sChat.settings.labels.sendPlaceholder}
          />
        </div>

        <SChatBoxOpener onClick={this.handleOpenerClick} isOpen={this.state.isOpen} />
      </div>
    );
  }
}

SChatBoxContained.defaultProps = {
  headerTitle: 'Chat with us!',
};
SChatBoxContained.propTypes = {
  headerTitle: React.PropTypes.string,
  messages: React.PropTypes.array,
  adminIsOnline: React.PropTypes.bool,
};

const SChatBox = createContainer(() => {
  const messages = sChat.messages.fetch();
  // const adminIsOnline = this.adminCollection.find({ status: true });
  const adminIsOnline = false;

  return {
    messages,
    adminIsOnline,
  };
}, SChatBoxContained);
export default SChatBox;
