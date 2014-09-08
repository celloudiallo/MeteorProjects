Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 5000
    });
});