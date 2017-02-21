import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import autosize from 'autosize';
import sChat from '../sChat';
import SChatBoxOpener from './SChatBoxOpener';

class SChatBoxContained extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      textareaValue: '',
    };
    if (Meteor.isClient) {
      this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      this.isIPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
    }
  }

  componentDidMount = () => {
    this.textarea.addEventListener('autosize:resized', this.handleTextareaResized);
    autosize(this.textarea);
    window.addEventListener('resize', () => { this.scrollToBottom(); });
    window.addEventListener('orientationchange', () => { this.scrollToBottom(); });
  }

  componentDidUpdate = (prevProps) => {
    autosize.update(this.textarea);

    if (prevProps.messages.length !== this.props.messages.length) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount = () => {
    this.textarea.removeEventListener('autosize:resized', this.handleTextareaResized);
    autosize.destroy(this.find('.schat-submit-input'));
  }

  handleTextareaResized = () => {
    this.scrollToBottom();
  }

  handleFocus = () => {
    if (!this.isIPhone) return;
    $(this.sChatBoxDiv).css({ 'max-height': '280px' });
  }

  handleBlur = () => {
    if (!this.isIPhone) return;
    $(this.sChatBoxDiv).css({ 'max-height': '' });
  }

  scrollToBottom = () => {
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
  }

  handleOpenerClick = () => {
    this.setState({ isOpen: true });
    Meteor.setTimeout(() => {
      autosize.update(this.textarea);
      this.scrollToBottom();
      $(this.textarea).click();
    }, 400);
  }

  handleTextAreaClick = () => {
    $(this.textarea).focus();
  }

  handleCloseClick = () => {
    this.setState({ isOpen: false });
  }

  handleKeyPress = (event) => {
    if (event.key !== 'Enter') return;
    if (!this.state.textareaValue.trim()) return;

    event.preventDefault();
    sChat.addMessage(this.state.textareaValue);

    this.setState({ textareaValue: '' });
    Meteor.setTimeout(() => { autosize.update(this.textarea); }, 10);
  }

  handleChange = (event) => {
    this.setState({ textareaValue: event.target.value });
    autosize.update(this.textarea);
  }

  renderWelcomeMessage = () => {
    return this.renderMessage({ isFromClient: false, msg: this.props.settings.welcomeMessage });
  }

  renderMessage = (message) => {
    return (
      <div className={'message' + (message.isFromClient ? ' from-client' : '')} key={message._id}>
        {!message.isFromClient ? this.props.avatar : null}
        <span className="text">{message.msg}</span>
      </div>
    );
  }

  render() {
    const settings = this.props.settings;
    const className = 'schat-box' +
      (this.props.adminIsOnline ? ' online' : '') +
      (this.state.isOpen ? ' open' : '');

    return (
      <div className="schat-wrapper">
        <div className={className} ref={(div) => { this.sChatBoxDiv = div; }}>

          <div className="header" onClick={this.handleCloseClick} ref={(div) => { this.headerDiv = div; }} >
            <span className="presence-indicator" />
            <span className="text">{settings.labels.headerTitle}</span>
          </div>

          <div className="messages" ref={(div) => { this.messagesDiv = div; }} >
            {this.renderWelcomeMessage()}
            {this.props.messages.map((m) => { return this.renderMessage(m); })}
          </div>

          <textarea
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            ref={(textarea) => { this.textarea = textarea; }}
            onKeyPress={this.handleKeyPress}
            onClick={this.handleTextAreaClick}
            onChange={this.handleChange}
            value={this.state.textareaValue}
            rows="1"
            placeholder={settings.labels.sendPlaceholder}
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
  settings: React.PropTypes.object,
  messages: React.PropTypes.array,
  adminIsOnline: React.PropTypes.bool,
  avatar: React.PropTypes.node,
};

const SChatBox = createContainer((props) => {
  if (!sChat.initialized) {
    sChat.init(props.settings);
  }
  sChat.subscribe();

  return {
    messages: sChat.fetchMessages(),
    adminIsOnline: sChat.fbAdminIsOnline() || sChat.adminIsOnline(),
  };
}, SChatBoxContained);
export default SChatBox;
