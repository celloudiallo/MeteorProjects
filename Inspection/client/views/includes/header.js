Template.header.helpers({
  getComputerID:function(){
    return localStorage.getItem("ComputerID");
  },
  getDisabled:function(){
    var user = Meteor.user();
    return (!user || (user.username !== "5043") || (Session.get("EditComputerID") !== true));
  },
  getLogin:function(){
    var computerID = localStorage.getItem("ComputerID");
    return computerID === '9999';
  }
});

Template.header.events({
  'blur #computerID':function(event, template){
    localStorage.setItem("ComputerID", event.target.value);
    Session.set("EditComputerID", false);
  },
  'click #computerIDText':function(event, template){
    var user = Meteor.user();
    if(!user || user.username !== "5043");
    Session.set("EditComputerID", true);
  }
});