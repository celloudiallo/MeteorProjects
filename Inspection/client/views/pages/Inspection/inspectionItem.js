Template.inspectionItem.helpers({
  getTimeInQueue:function(){
    Session.get('TimerOneMinute');
    var item = this.item;
    if(item.status==="Ready")
      return moment.duration(new Date().valueOf() - item.added.time).humanize();
    else if(item.status==="Inspecting")
      return moment.duration(new Date().valueOf() - item.inspStart.time).humanize();
    else if((item.status==="Passed") || (item.status==="Failed"))
      return moment.duration(new Date().valueOf() - item.inspEnd.time).humanize();
  },
  getUser:function(){
    var item = this.item;
    if(item.status==="Ready")
      return item.added.user;
    else if(item.status==="Inspecting")
      return item.inspStart.user;
    else if((item.status==="Passed") || (item.status==="Failed"))
      return item.inspEnd.user;
  },
  getEditAccess:function(){
    var user = Meteor.user();
    if(!user) return false;
    var allowed = ['5043', '1393'];
    return _.indexOf(allowed, user.username) >= 0;
  }
});

Template.inspectionItem.rendered = function(){
  this.$(".inspectionItem-buttons").hide();
};

Template.inspectionItem.events({
  'click .inspectionItem-move-up':function(event, template){
    var id = template.$('.inspection-item')[0].id;
    Reveal.Inspection.incPriority(id);
  },
  'click .inspectionItem-move-down':function(event, template){
    var id = template.$('.inspection-item')[0].id;
    Reveal.Inspection.decPriority(id);
  },
  'click .inspectionItem-remove':function(event, template){
    var id = template.$('.inspection-item')[0].id;
    Reveal.Inspection.remove(id);
  },
  'mouseenter .dd-item':function(event, template){
    $(event.target).find(".inspectionItem-buttons").show();
  },
  'mouseleave .dd-item':function(event, template){
    $(event.target).find(".inspectionItem-buttons").hide();
  }
});