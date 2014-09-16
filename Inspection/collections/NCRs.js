if (Meteor.isServer){
  NCRs = new Meteor.Collection('ncrs'); 
  NCRs.allow({
    insert: function (userId, doc) {return true;},
    update: function (userId, docs, fields, modifier) {return true;},
    remove: function (userId, doc){return true;}
  });
  //Enable schema validation for this collection
  //NCRs.deny(_.clone(FormBuilder.validate("NCRs")));
  NCRs.deny(FormBuilder.validate("NCRs"));
}
if (Meteor.isClient){
  NCRs = new Meteor.Collection('ncrs');
}


//Server and client need to see the same schema
NCRs.schema = {
  Item:{
    controller: 'fbControllerTypeahead',
    view: 'fbViewTypeahead',
    labelText: 'Item',
    asYouType: true,
    //Specific
    dataSource: 'Items.uniqueID',
    placeholder: 'Select the Item'
  },
  Description: {
    controller: 'fbControllerText',
    view: 'fbViewText',
    labelText: 'Description',
    asYouType: true,
    maxLength:30,
    filter:7
  }
};