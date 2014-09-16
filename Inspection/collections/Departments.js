Departments = new Meteor.Collection('departments');

if(Meteor.isServer && (Departments.find().count() === 0)){
  var data = [
    {name:"Design"},
    {name:"Buisness Development"},
    {name:"Accounts"},
    {name:"Electrical"},
    {name:"Fitting"},
    {name:"Fabrication"},
    {name:"Planning"},
    {name:"Projects"}
  ];
  _.each(data, function(doc){
    Departments.insert(doc);
  });
}