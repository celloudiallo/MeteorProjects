Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading'
});

Router.map(function(){
  this.route('', {path: '/', action: function(){this.redirect('/home');}});
  this.route('home', {path: '/home'});
  this.route('inspection', {path: '/inspection'});
});