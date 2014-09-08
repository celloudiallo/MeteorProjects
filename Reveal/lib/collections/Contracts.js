// Contracts -- data model
// Loaded on both the client and the server
//title, createdAt
Contracts = new Meteor.Collection("contracts", {
  schema: {
    title: {
      type: String,
      label: "Job Title",
      max: 40,
      unique: true
    },
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date()};
        } else {
          this.unset();
        }
      }
    }
  }
});

Contracts.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});