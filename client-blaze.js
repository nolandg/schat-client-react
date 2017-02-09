
Template.sChatBox.onCreated(function () {
    this.sChatMessages = new ReactiveVar(null);
    this.adminStatus = new ReactiveVar(false);
    this.isIOS = new ReactiveVar(false);
});

Template.sChatBox.onRendered(function () {
    const tmpl = this;
    const messages = tmpl.$('.js-chat-messages');
    const input = tmpl.$('.js-chat-submit-input');
    const data = Template.currentData();
    const userSessionId = data && data.userSessionId;
    const userAgentMatch = navigator.userAgent && navigator.userAgent.match(/iPhone|iPad|iPod/i);

    if (userAgentMatch && userAgentMatch.length) {
        tmpl.isIOS.set(true);
    }

    tmpl.autorun(() => {
        if (sChat.messages.count()) {
            tmpl.sChatMessages.set(sChat.messages);
            messages[0].scrollTop = messages[0].scrollHeight;
        }
    });
    sChat.autosize(tmpl.find('.s-chat-submit-input'));

    const adminStatusObserveFunc = (id, fields) => {
        if (fields.status && fields.status.online) {
            tmpl.adminStatus.set(fields.status.online);
        } else {
            tmpl.adminStatus.set(false);
        }
    };
    tmpl.handleAdminStatusObserve = sChat.adminStatusCurr.observeChanges({
        added: adminStatusObserveFunc,
        changed: adminStatusObserveFunc
    });

    tmpl.textareaInitSize = input.outerHeight();
    tmpl.messagesInitSize = $(messages).outerHeight();
});

Template.sChatBox.onDestroyed(function () {
    sChat.autosize.destroy(this.find('.s-chat-submit-input'));
    this.handleAdminStatusObserve.stop();
});

Template.sChatBox.events({
    'click .js-chat-box-open'(e, tmpl) {
        tmpl.find('.s-chat-box').classList.add('opened');
        tmpl.find('.s-chat-box-opener').classList.add('hidden');
        Meteor.setTimeout(() => {
            tmpl.find('.s-chat-submit-input').focus();
        }, 0);
    },
    'click .js-chat-box-close'(e, tmpl) {
        tmpl.find('.s-chat-box').classList.remove('opened');
        tmpl.find('.s-chat-box-opener').classList.remove('hidden');
    },
    'keydown .js-chat-submit-input'(e) {
        const tmpl = Template.instance();
        const data = Template.currentData();
        const msg = $(e.currentTarget).val();
        const clientAppId = sChat.clientAppId;
        const userSessionId = sChat.userSessionId;
        const key = e.keyCode || e.which;
        const isFromClient = true;
        if (key === 13 && !e.shiftKey) {
            e.preventDefault();
            if (msg.trim() !== '') {
                sChat.ddp.call('addChatMessage', msg, clientAppId, userSessionId, isFromClient);
                $(e.currentTarget).val('');
                const messages = $(e.currentTarget).closest('.js-chat-box').find('.js-chat-messages')[0];
                messages.scrollTop = messages.scrollHeight;
                $(messages).outerHeight(tmpl.messagesInitSize);
                sChat.autosize.update($(e.currentTarget));
            }
        }
    },
    // autosize textarea plugin events
    'autosize:resized .js-chat-submit-input'(e) {
        const tmpl = Template.instance();
        const messages = tmpl.$('.js-chat-messages');
        const input = $(e.currentTarget);
        const textareaSize = input.outerHeight();
        const messagesSize = messages.outerHeight();
        const initialSizesSum = tmpl.textareaInitSize + tmpl.messagesInitSize;
        if (textareaSize + messagesSize > initialSizesSum) {
            messages.outerHeight(initialSizesSum - textareaSize);
            messages[0].scrollTop = messages[0].scrollHeight;
        }
    }
});

Template.sChatBox.helpers({
    sChatHeaderTitle() {
        return sChat.settings.labels.headerTitle;
    },
    isWelcomeMessage() {
        return sChat.settings.welcomeMessage;
    },
    sChatMessages() {
        const tmpl = Template.instance();
        return tmpl.sChatMessages.get();
    },
    sChatInputPlaceholder() {
        return sChat.settings.labels.sendPlaceholder;
    },
    isIOS() {
        const tmpl = Template.instance();
        return tmpl.isIOS.get();
    },
    isAdminActive() {
        const tmpl = Template.instance();
        return tmpl.adminStatus.get();
    }
});

Template.sChatBoxWelcomeMessage.helpers({
    sChatWelcomeMessage() {
        return sChat.settings.welcomeMessage;
    }
});