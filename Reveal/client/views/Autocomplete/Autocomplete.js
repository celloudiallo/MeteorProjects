Meteor.subscribe('standardLegends');

Template.autocomplete1.settings = {
  position: 'bottom',
  limit: 10,
  rules: [
    {
      // token: '',
      collection: People,
      field: 'forename',
      matchAll: true,
      template: Template.standardLegends,
      noMatchTemplate: Template.serverNoMatch
    }
  ]
};