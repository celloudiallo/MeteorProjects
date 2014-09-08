Template.inspection.helpers({
  getReadyToInspect:function(){
    return InspectionItems.find({status:'Ready'}, {sort: {priority : 1 }});
  },
  getInspecting:function(){
    return InspectionItems.find({status:'Inspecting'}, {sort: {priority : 1 }});
  },
  getPassed:function(){
    return InspectionItems.find({status:'Passed'}, {sort: {priority : 1 }});
  },
  getFailed:function(){
    return InspectionItems.find({status:'Failed'}, {sort: {priority : 1 }});
  }
});

Template.inspection.created = function(){
  var template = this;
  this.timer = Meteor.setInterval(function(){
    var value = !Session.get('TimerOneMinute');
    Session.set('TimerOneMinute', value);
  }, 60000);
  FormBuilder.setHook('form1', 'beforeCreate', function(obj){
    if(Reveal.Inspection.addItem(obj, false, false)){
      template.$('.popup-bookIn').modal('hide');
      return true;
    }
    return false;
  });
  FormBuilder.setHook('form2', 'beforeUpdate', function(obj){
    var formObj = FormBuilder.forms.findOne($(".popup-ncr .form-horizontal")[0].name);
    if (Reveal.Inspection.moveInspectingToFailed(formObj.document, null, obj.NC)){
      template.$('.popup-ncr').modal('hide');
      return true;
    }
    return false;
  });
  
}

Template.inspection.destroyed = function(){
  FormBuilder.removeHook('form1', 'beforeCreate');
  FormBuilder.removeHook('form2', 'beforeUpdate');
  Meteor.clearInterval(this.timer);
}


Template.inspection.events({
  'click .btn-bookIn':function(event, template){
    template.$('.popup-bookIn').modal('show');
  },
  'click .inspection-item':function(event, template){
    var item = InspectionItems.findOne({_id:event.target.id});
    if((item.status === 'Ready') || (item.status === 'Inspecting'))
      Reveal.Inspection.moveItemUp(event.target.id);
  },
  'qrScan-complete':function(event, template, extra){
    if(!extra || (typeof extra.value !== 'string'))
       Notifications.error("Scan failed", "Incorrect data!\n");
    else{
      var type = extra.value.substring(0, 2);
      var bookInTypes = ['PA','SE','QT','IT','GR'];
      if(type === "PE") Reveal.logIn(extra.value);
      else if(bookInTypes.indexOf(type) >= 0) Reveal.Inspection.bookItemIn(extra.value);
      else Notifications.error("Scan failed", "Incorrect data!\n"+extra.value);
    }
  }
});