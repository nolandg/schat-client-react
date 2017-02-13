import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import sChat from 'meteor/schat:client-core';
import SChatBoxOpener from './SChatBoxOpener';

class SChatBoxContained extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      messageBox: '',
      isIOS: false,
    };
  }

  componentDidMount = () => {
    sChat.autosize(this.textarea);
    this.textarea.addEventListener('autosize:resized', this.handleTextareaResized);
    this.textareaInitSize = $(this.textarea).outerHeight();
    this.messagesInitSize = $(this.chatMessages).outerHeight();

    // Set the isIOS state based on user agent.
    // We can't do this earlier because then it would attempt to access user agent on the server
    // This way the component will render exactly the same on both sides
    // and then add the proper ios class after it's mounted
    const userAgentMatch = navigator.userAgent && navigator.userAgent.match(/iPhone|iPad|iPod/i);
    if (userAgentMatch && userAgentMatch.length) {
      this.setState({ isIOS: true });
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.messages.length) {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    if ((prevProps.messages && !prevProps.messages.length) && (this.props.messages && this.props.messages.length)) {
      // We went from having no messages to having some so update the initial heights because they will be wrong
      // if they were set with no messages
      Meteor.setTimeout(() => {
        this.textareaInitSize = $(this.textarea).outerHeight();
        this.messagesInitSize = $(this.chatMessages).outerHeight();
      }, 10);
    }

    window.addEventListener('resize', () => { this.setMessagesHeight(); });
    window.addEventListener('orientationchange', () => { this.setMessagesHeight(); });
  }

  componentWillUnmount = () => {
    this.textarea.removeEventListener('autosize:resized', this.handleTextareaResized);
    sChat.autosize.destroy(this.find('.s-chat-submit-input'));
  }

  handleTextareaResized = () => {
    const textareaSize = $(this.textarea).outerHeight();
    const messagesSize = $(this.chatMessages).outerHeight();
    const initialSizesSum = this.textareaInitSize + this.messagesInitSize;
    if (textareaSize + messagesSize > initialSizesSum) {
      this.setMessagesHeight(initialSizesSum - textareaSize);
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
  }

  setMessagesHeight = (height) => {
    let newHeight = height || 300;
    const textareaSize = $(this.textarea).outerHeight();
    const headerSize = $(this.header).outerHeight();
    const totalNewHeight = newHeight + textareaSize + headerSize;
    if (totalNewHeight > (window.innerHeight - 10)) {
      newHeight = window.innerHeight - textareaSize - headerSize - 10;
    }
    $(this.chatMessages).outerHeight(newHeight);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  handleOpenerClick = () => {
    this.setState({ isOpen: true });
    Meteor.setTimeout(() => {
      this.textarea.focus();
      this.setMessagesHeight();
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }, 350);
  }
  handleCloseClick = () => {
    this.setState({ isOpen: false });
  }

  handleKeyDown = (event) => {
    if (event.keyCode !== 13) return;
    if (!this.state.messageBox.trim()) return;

    event.preventDefault();
    sChat.ddp.call(
      'addChatMessage',
      this.state.messageBox,
      sChat.clientAppId,
      sChat.userSessionId,
      true // is from client
    );

    this.setState({ messageBox: '' });
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    this.setMessagesHeight(this.messagesInitSize);
    Meteor.setTimeout(() => { sChat.autosize.update(this.textarea); }, 10);
  }

  handleChange = (event) => {
    this.setState({ messageBox: event.target.value });
  }

  renderWelcomeBoxMessage = () => {
    return (
      <div id="s-chat-box-welcome-message" className="s-chat-box-welcome-message s-chat-message-item">
        {this.props.avatar}
        <div id="s-chat-box-welcome-message-text" className="s-chat-box-welcome-message-text message">
          {sChat.settings.welcomeMessage}
        </div>
      </div>
    );
  }

  renderMessages = () => {
    return this.props.messages.map((m) => {
      const avatar = !m.isFromClient ? this.props.avatar : null;
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
          <div id="s-chat-box-header" className="s-chat-box-header js-chat-box-close" onClick={this.handleCloseClick} ref={(div) => { this.header = div; }} >
            <div className="s-chat-header-title">
              <span className="s-chat-presence-indicator" />
              {this.props.options.labels.headerTitle}
            </div>
          </div>

          <div id="s-chat-messages" className="s-chat-messages js-chat-messages" ref={(div) => { this.chatMessages = div; }} >
            {sChat.settings.welcomeMessage ? this.renderWelcomeBoxMessage() : null}
            {this.renderMessages()}
          </div>

          <textarea
            ref={(textarea) => { this.textarea = textarea; }}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            value={this.state.messageBox}
            id="s-chat-submit-input"
            className={'s-chat-submit-input js-chat-submit-input' + (this.state.isIOS ? ' s-chat-submit-input-ios' : '')}
            rows="1"
            placeholder={sChat.settings.labels.sendPlaceholder}
          />
        </div>

        <SChatBoxOpener onClick={this.handleOpenerClick} isOpen={this.state.isOpen} adminIsOnline={this.props.adminIsOnline} />
      </div>
    );
  }
}

SChatBoxContained.defaultProps = {
};
SChatBoxContained.propTypes = {
  options: React.PropTypes.object,
  messages: React.PropTypes.array,
  adminIsOnline: React.PropTypes.bool,
  avatar: React.PropTypes.node,
};

const SChatBox = createContainer((props) => {
  if (!sChat.initialized) {
    sChat.init(props.siteId, props.options);
  }
  sChat.subscribe();
  const messages = sChat.messages ? sChat.messages.fetch() : [];
  const onlineAdmins = sChat.adminCollection.find({ 'status.online': true }).fetch();
  const adminIsOnline = !!onlineAdmins.length;

  return {
    messages,
    adminIsOnline,
  };
}, SChatBoxContained);
export default SChatBox;
