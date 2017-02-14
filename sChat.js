import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';

export default {
  initialized: false,
  settings: {
    ssl: true,
    hostName: 'localhost:3000',
    welcomeMessage: 'Hi, how can I help you?',
    labels: {
      sendPlaceholder: 'Send message...',
      headerTitle: 'SimpleChat.Support',
    },
  },

  addMessage(text) {
    this.ddp.call(
      'addChatMessage',
      text,
      this.settings.clientAppId,
      this.userSessionId,
      true // is from client
    );
  },

  init(settingsObj) {
    if (_.isObject(settingsObj)) this.settings = _.extend(this.settings, settingsObj);
    else throw new Meteor.Error(400, 'Config must be an object!');

    const protocol = this.settings.ssl ? 'https' : 'http';
    this.ddp = DDP.connect(protocol + '://' + this.settings.hostName);

    this.chatCollection = new Mongo.Collection('chat', { connection: this.ddp });
    this.adminCollection = new Mongo.Collection('users', { connection: this.ddp });
    this.fbAdminCollection = new Mongo.Collection('fbAdmins', { connection: this.ddp });

    this.userSessionId = 'empty on server';
    if (Meteor.isClient) {
      this.userSessionId = sessionStorage.getItem('sChatUserSessionId') || Random.id();
      if (sessionStorage && !sessionStorage.getItem('sChatUserSessionId')) {
        sessionStorage.setItem('sChatUserSessionId', this.userSessionId);
      }
    }

    this.initialized = true;
  },

  fetchMessages() {
    return this.chatCollection.find({ userSessionId: this.userSessionId }, { sort: { date: 1 } }).fetch();
  },

  adminIsOnline() {
    return !!this.adminCollection.find({ 'status.online': true }).fetch().length;
  },

  fbAdminIsOnline() {
    return !!this.fbAdminCollection.find({ online: true }).fetch().length;
  },

  subscribe() {
    this.ddp.subscribe('Meteor.users.adminStatus', this.settings.clientAppId);
    this.ddp.subscribe('Chat.messagesList', this.settings.clientAppId, this.userSessionId);
    this.ddp.subscribe('FbAdmins', this.settings.clientAppId);
  },
};
