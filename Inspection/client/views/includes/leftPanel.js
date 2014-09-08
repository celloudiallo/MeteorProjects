Template.leftPanel.events({
  'click .minifyme' : function(event, template){
    template.$('#left-panel').parent('body').toggleClass("minified");
  },
  'click .login-username' : function(event, template){
    event.stopPropagation();
  },
  'click .login-clocknumber' : function(event, template){
    event.stopPropagation();
  },
  'click .logout-button' : function(event, template){
    Meteor.logout();
  },
  'click .login-button' : function(event, template){
    Reveal.logIn('PE' + template.$('.login-clocknumber').val());
  },
  'input .login-username' : function(event, template){
    var user =  Meteor.user();
    user.profile.fullname = event.target.value;
    Meteor.users.update({_id:user._id}, {$set:{profile:user.profile}});
  }
});

Template.leftPanel.helpers({
  getFullname:function(){
    var user =  Meteor.user();
    if(!user)
      return "Click or scan to log in";
    else if(user.profile && (typeof user.profile.fullname === 'string') && (user.profile.fullname !== ""))
      return user.profile.fullname;
    else
      return "Click to set name";
  }
});

Template.leftPanel.rendered = function(){
  var template = this;
  //Update the user info
  template.autorun(function(){
    var user = Meteor.user();
    var image = template.$('img.userimage');
    if(user){//logged in
      image.addClass('online');
      image.removeClass('offline');
      image.attr('src', 'img/avatars/' + user.username + '.png');
    }else{//not logged in
      image.removeClass('online');
      image.addClass('offline');
      image.attr('src', 'img/avatars/male.png');
    }
  });
  //Update the sparkline
  template.autorun(function () {
    var readyToInspect = InspectionItems.find({status:'Ready'}).count();
    var beingInspected = InspectionItems.find({status:'Inspecting'}).count();
    var passedInspection = InspectionItems.find({status:'Passed'}).count();
    var failedInspection = InspectionItems.find({status:'Failed'}).count();
    var values =  [readyToInspect, beingInspected, passedInspection, failedInspection];
    template.$('.sparklineInspection').sparkline(values, {type: 'bar', chartRangeMin: 0, colorMap: ["grey", "blue", "green", "red"]} );
  });
  //Update which page is currently diplayed
  template.autorun(function () {
    var path = Router.current().path;
    template.$('a.navbar-link').each(function(index){
      if(this.href.endsWith(path)){
        $(this).parent('li').addClass('active');
      }else{
        $(this).parent('li').removeClass('active');
      }    
    });
  });
};