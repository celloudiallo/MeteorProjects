if (Meteor.isServer){
  InspectionItems = new Meteor.Collection('inspectionItems'); 
  InspectionItems.allow({
    insert: function (userId, doc) {return true;},
    update: function (userId, docs, fields, modifier) {return true;},
    remove: function (userId, doc){return true;}
  });
  //Enable schema validation for this collection 
  InspectionItems.deny(FormBuilder.validate("InspectionItems"));
}
if (Meteor.isClient){
  InspectionItems = new Meteor.Collection('inspectionItems',{ 
    transform: function(doc){
      //Add computed fields
      var result = "PA"+doc.PA+", ";
      if(doc.SE) result += "Sect "+doc.SE+", ";
      result += "Qty "+doc.QT+", ";
      if(doc.IT) result += "Item "+doc.IT+", ";
      if(doc.GR) result += "GRN"+doc.GR+", ";
      if(doc.NC) result += "NCR"+doc.NC+", ";
      doc.summary = result.substring(0, result.length - 2);
      return doc;
    }
  });
}


function randomIntFromInterval(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
};

function createRandomHistory(statusInt){
  var addedDaysAgo = randomIntFromInterval(2,40);
  var inspStartDaysAgo = randomIntFromInterval(1,addedDaysAgo);
  var inspEndDaysAgo = randomIntFromInterval(0,inspStartDaysAgo);
  var obj = {};
  obj.added = {user:5043, area:randomIntFromInterval(1,3), time:new Date().valueOf() - ((24*60*60*1000) * addedDaysAgo)};
  obj.inspStart = statusInt>0?{user:5043, area:randomIntFromInterval(1,3), time:new Date().valueOf() - ((24*60*60*1000) * inspStartDaysAgo)}:{};
  obj.inspEnd = statusInt>1?{user:5043, area:randomIntFromInterval(1,3), time:new Date().valueOf() - ((24*60*60*1000) * inspEndDaysAgo)}:{};
  return obj;
};

function createRandomObj(priority){
  var statusTxt = ["Ready","Inspecting","Passed","Failed"];
  var statusInt = randomIntFromInterval(0,3);
  var history = createRandomHistory(statusInt);
  var obj = {PA:randomIntFromInterval(40000,40482),
     SE:randomIntFromInterval(1,300),
     QT:randomIntFromInterval(1,10),
     IT:randomIntFromInterval(1,100),
     GR:"",
     NC:"",
     priority:0,
     status:statusTxt[statusInt],
     added:history.added,
     inspStart:history.inspStart,
     inspEnd:history.inspEnd
    };
  obj.priority = priority[obj.status];
  priority[obj.status]++;
  return obj;
}

if(Meteor.isServer && (InspectionItems.find().count() === 0) && false){
  var priority = {Ready:0,Inspecting:0,Passed:0,Failed:0};
  for(var i = 0; i<50;i++){
    InspectionItems.insert(createRandomObj(priority));
  }
}


//Server and client need to see the same schema
InspectionItems.schema = {
  PA: {
    controller: 'fbControllerTypeahead',
    view: 'fbViewTypeahead',
    labelText: 'PA',
    //Specific
    dataSource: 'PAs.PA',
    placeholder: 'Select the PA Number',
    isNumber :true,
    filter:7
  },
  SE: {
    controller: 'fbControllerText',
    view: 'fbViewText',
    labelText: 'Section',
    asYouType: true,
    maxLength:10,
    filter:7
  },
  QT: {
    controller: 'fbControllerNumber',
    view: 'fbViewNumber',
    labelText: "Quantity",
    asYouType: true,
    //Specific
    minValue: 1,
    maxValue: 50000,
    places:1,
    filter:7
  },
  IT: {
    controller: 'fbControllerText',
    view: 'fbViewText',
    labelText: "Item",
    asYouType: true,
    optional:true,
    maxLength:10,
    filter:7
  },
  GR: {
    controller: 'fbControllerNumber',
    view: 'fbViewNumber',
    labelText: "Goods Reciept Note (GRN) Number",
    asYouType: true,
    optional:true,
    //Specific
    minValue: 1,
    maxValue: 99999999,
    places:1,
    filter:7
  },
  NC: {
    controller: 'fbControllerNumber',
    view: 'fbViewNumber',
    labelText: "Non-Conformance (NC) Number",
    asYouType: true,
    optional:true,
    //Specific
    minValue: 1,
    maxValue: 99999999,
    places:1,
    filter:12
  },
  priority: {
    controller: 'fbControllerNumber',
    view: 'fbViewNumber',
    labelText: "Priority",
    asYouType: true,
    //Specific
    minValue: 0,
    maxValue: 9999,
    places:1,
    filter:4
  },
  status: {
    controller: 'fbControllerText',
    view: 'fbViewText',
    labelText: 'Status',
    asYouType: true,
    maxLength:10,
    filter:4
  },
  added:{
    controller: 'fbControllerUnchecked'
  },
  inspStart:{
    controller: 'fbControllerUnchecked'
  },
  inspEnd:{
    controller: 'fbControllerUnchecked'
  }
};