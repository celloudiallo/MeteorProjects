//People
Meteor.publish("people", function() {
    return People.find();
});

Meteor.publish('personSingle', function(id) {
  return id && Posts.find(id);
});

Meteor.publish('peopleNames', function(id) {
  return id && Posts.find({},{fields: {forename: true, middlename: true, surname:true}});
});

//Contracts
Meteor.publish("contracts", function() {
    return Contracts.find();
});

//Images
Meteor.publish("images", function() {
    return Images.find();
});