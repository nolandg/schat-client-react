Package.describe({
    name: 'schat:client-blaze',
    version: '1.2.0',
    summary: 'sChat client app for Meteor - Blaze view layer',
    git: 'https://github.com/juliancwirko/meteor-schat-client-blaze.git',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('templating');
    api.use('reactive-var');
    api.use('schat:client-core@1.2.0');
    api.imply('schat:client-core@1.2.0');
    api.addFiles('client-blaze.css', 'client');
    api.addFiles('client-blaze.html', 'client');
    api.addFiles('client-blaze.js', 'client');
});