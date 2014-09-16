Reveal = {};
Reveal.logIn = function(personCode){
  if(typeof personCode !== 'string')
      Notifications.error('Login failed', "Incorrect clock in numer:" + personCode);
    else{
        var type = personCode.substring(0, 2);
        var data = personCode.substring(2, personCode.length);
        var dataInt = parseInt(data);
        if((type === "PE") && (!isNaN(dataInt)) && (dataInt > 0) && (dataInt < 9999)){
          Meteor.loginWithPassword("" + dataInt, "nis.ltd1", function(error){
            if(error) Notifications.error('Login failed', error);
            else {
              //while(Meteor.loggingIn()){}//wait for log in complete
              Notifications.success('Login', 'Hello ' + Meteor.user().profile.fullname);
            }
          });
        }
        else
          Notifications.error('Login failed', "Incorrect clock in numer:" + personCode);
    }
};


Reveal.Inspection = {};
Reveal.Inspection.bookItemIn = function(itemCode){
  if(typeof itemCode !== 'string')
       Notifications.error("Book Item in failed", "Incorrect data!\n");
    else{
      var obj = {};
      _.each(itemCode.split(','),function(value){
        var type = value.substring(0, 2);
        var data = value.substring(2, value.length);
        var dataInt = parseInt(data);
        if((type === "PA") && (!isNaN(dataInt)) && (dataInt > 14000) && (dataInt < 50000))
           obj.PA = dataInt;
        else if((type === "SE") && (data.length > 0) && (data.length < 10))
           obj.SE = data;
        else if((type === "QT") && (!isNaN(dataInt)) && (dataInt > 0) && (dataInt < 9999))
           obj.QT = dataInt;
        else if((type === "IT") && (!isNaN(dataInt)) && (dataInt > 0) && (dataInt < 9999))
           obj.IT = dataInt;
        else if((type === "GR") && (!isNaN(dataInt)) && (dataInt > 0) && (dataInt < 99999999))
           obj.GR = dataInt;
        else
           Notifications.error("Book Item in failed", "Incorrect data!\n" + value);
      });
      Reveal.Inspection.addItem(obj, true, true);
    }
};
Reveal.Inspection.defaultChecks = function(){
  var user = Meteor.user()
  if(!user) {
    Notifications.error("Book Item in failed", "Log in first"); 
    return null;
  }
  var computerID = localStorage.getItem("ComputerID");
  if(!computerID) {
    Notifications.error("Book Item in failed", "Set the computer ID first"); 
    return null;
  }
  return {user:user, computerID:computerID};
}
Reveal.Inspection.incPriority = function(id){
  var item = InspectionItems.findOne({_id:id});
  InspectionItems.update({_id:item._id}, {$set:{priority:item.priority - 1.5}});
  Reveal.Inspection.resetPriority(item.status);
};
Reveal.Inspection.decPriority = function(id){
  var item = InspectionItems.findOne({_id:id});
  InspectionItems.update({_id:item._id}, {$set:{priority:item.priority + 1.5}});
  Reveal.Inspection.resetPriority(item.status);
};
Reveal.Inspection.remove = function(id){
  var item = InspectionItems.findOne({_id:id});
  bootbox.confirm("Are you sure you want to delete this item?<br><b>" + item.summary + "</b>", function(confirm) {
      if(confirm) 
         InspectionItems.remove(id);
    });
}
Reveal.Inspection.getPriority = function(queue){
  var items = InspectionItems.find({status:queue}, {sort: {priority : 1 }}).fetch();
  var endItem = items[items.length-1];
  return endItem ? endItem.priority + 1 : 0;
};
Reveal.Inspection.resetPriority = function(queue){
  var priority = 0;
  InspectionItems.find({status:queue}, {sort: {priority : 1 }}).forEach(function(item){
    InspectionItems.update({_id:item._id}, {$set:{priority:priority}});
    priority++;
  });
};
Reveal.Inspection.addItem = function(obj, insert, move){
  var checks = Reveal.Inspection.defaultChecks();
  if(!checks)return;
  //Items route card was scanned
  if((!obj.PA || !obj.SE || !obj.IT) && (!obj.PA || !obj.GR)){
    Notifications.error("Book Item in failed", "Not enough information!<br><b>" + obj + "</b>");
    return;
  }
  obj.priority = Reveal.Inspection.getPriority('Ready'); 
  obj.status = 'Ready';
  obj.added = {user:checks.user.username, area:checks.computerID, time:new Date().valueOf()};
  obj.inspStart = {};
  obj.inspEnd = {};
  obj.NC = null;
  
  var duplicate = (obj.PA && obj.SE && obj.IT && InspectionItems.findOne({PA:obj.PA, SE:obj.SE, IT:obj.IT})) || (obj.GR && obj.PA && InspectionItems.findOne({PA:obj.PA, GR:obj.GR}));
  if(duplicate){
    if(move)
      return Reveal.Inspection.moveItemUp(duplicate._id);
    else{
      Notifications.error("Book Item in failed", "This item already exists"); 
      return;
    }
  }
  if(insert)InspectionItems.insert(obj);
  return obj;
};
Reveal.Inspection.moveItemUp = function(id, checks){
  var result = null;
  checks = checks || Reveal.Inspection.defaultChecks();
  if(!checks)return result;
  var item = InspectionItems.findOne({_id:id});
  if(!item) return result;
  if(item.status==='Ready'){
    bootbox.confirm("Are you going to start inspecting this item?<br><b>" + item.summary + "</b>", function(confirm) {
      if(confirm) 
        result = Reveal.Inspection.moveReadyToInspecting(id);
    });
  }
  else if(item.status==='Inspecting'){
    if(Meteor.user().username !== item.inspStart.user)
        Notifications.error("Move item up failed", "You are not the owner of this item.");
    else
        bootbox.dialog({
      message: "Have you finished inspecting this item?<br><b>" + item.summary + "</b><br>If so did it pass or fail inspection?",
      title: "Inspection Finished?",
      closeButton: true,
      buttons: {
        passed: {
          label: "Passed",
          className: "btn-success",
          callback: function() {
            result = Reveal.Inspection.moveInspectingToPassed(id);
          }
        },
        failed: {
          label: "Failed",
          className: "btn-danger",
          callback: function() {
            var formID = $(".popup-ncr .form-horizontal")[0].name;
            FormBuilder.helpers.setDocument(formID, id);
            $('.popup-ncr').modal('show');
            result = true;
          }
        },
        cancel: {
          label: "Cancel",
          className: "btn-default"
        }
      }
    });
  }
  else
    Notifications.error("Move item up failed", "Already finished!<br><b>" + item.summary + "</b>");
  return result;
}
Reveal.Inspection.moveReadyToInspecting = function(id, checks){
  checks = checks || Reveal.Inspection.defaultChecks();
  if(!checks)return;
  var priority = Reveal.Inspection.getPriority('Inspecting');
  var inspStart = {user:checks.user.username, area:checks.computerID, time:new Date().valueOf()};
  InspectionItems.update({_id:id}, {$set:{status:'Inspecting', priority:priority, inspStart:inspStart}});
  Reveal.Inspection.resetPriority('Ready');
  return true;
}
Reveal.Inspection.moveInspectingToPassed = function(id, checks){
  checks = checks || Reveal.Inspection.defaultChecks();
  if(!checks)return;
  var priority = Reveal.Inspection.getPriority('Passed');
  var inspEnd = {user:checks.user.username, area:checks.computerID, time:new Date().valueOf()};
  InspectionItems.update({_id:id}, {$set:{status:'Passed', priority:priority, inspEnd:inspEnd}});
  Reveal.Inspection.resetPriority('Inspecting');
  return true;
}
Reveal.Inspection.moveInspectingToFailed = function(id, checks, NCR){
  checks = checks || Reveal.Inspection.defaultChecks();
  if(!checks)return;
  var priority = Reveal.Inspection.getPriority('Failed');
  var inspEnd = {user:checks.user.username, area:checks.computerID, time:new Date().valueOf()};
  InspectionItems.update({_id:id}, {$set:{NC:NCR, status:'Failed', priority:priority, inspEnd:inspEnd}});
  Reveal.Inspection.resetPriority('Inspecting');
  return true;
}