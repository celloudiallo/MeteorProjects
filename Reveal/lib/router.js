Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return [
      Meteor.subscribe('people'),
      Meteor.subscribe('images'),
      Meteor.subscribe('contracts')
    ]
  }
});

Router.map(function() {
  this.route('insertPersonForm', {
    path: '/'
  });

  this.route('updatePersonForm', {
    path: '/posts/:_id/edit',
    data: function() { return People.findOne(this.params._id); }
  });
});

Router.onBeforeAction('loading');

