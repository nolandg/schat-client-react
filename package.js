/* eslint-disable */

Package.describe({
    name: 'noland:schat-client-react',
    version: '0.1.0',
    summary: 'sChat client app for Meteor - React view layer',
    git: 'https://github.com/nolandg/schat-client-react.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.4.2');
    api.use('ecmascript');
    // api.use('templating');
    api.use('reactive-var');
    api.use('schat:client-core@1.2.0');
    api.imply('schat:client-core@1.2.0');
    api.mainModule('client-react.js');
});
