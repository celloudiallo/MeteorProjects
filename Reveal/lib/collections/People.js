// People -- data model
// Loaded on both the client and the server
//clockNumber,forename,surname,middlename,dateOfBirth,dateJoined,houseID,street,city,county,country,postCode,phoneNumber,extension,carReg,email,location,image,jobTitle,department,contract,documents,supervisors,supervising, assignedTasks,currentTask, assets,createdAt
People = new Meteor.Collection("people", {
    schema: {
        clockNumber: {
            type: Number,
            label: "Clock Number",
            min: 0,
            max: 9999,
            unique: true
        },
        forename: {
            type: String,
            label: "Forname",
            max: 30
        },
        surname: {
            type: String,
            label: "Surname",
            max: 30
        },
        middlename: {
            type: [String],
            label: "Middle names",
            max: 30,
            optional: true,
            maxCount: 4,
            minCount: 2
        },
        dateOfBirth: {
            type: Date,
            label: "Date of birth",
            max: new Date()
        },
        dateJoined: {
            type: Date,
            label: "Date of employment",
            max: new Date()
        },
        houseID: {
            type: String,
            label: "House Name/Number",
            max: 30
        },
        street: {
            type: String,
            label: "Street",
            max: 30
        },
        city: {
            type: String,
            label: "City/Town",
            max: 30
        },
        county: {
            type: String,
            label: "County",
            max: 30
        },
        country: {
            type: String,
            label: "Country",
            max: 30
        },
        postCode: {
            type: String,
            label: "Post Code",
            max: 10
        },
        phoneNumber: {
            type: String,
            optional: true,
            label: "Phone Number"
        },
        extension: {
            type: Number,
            optional: true,
            label: "Extension",
            max: 999
        },
        carReg: {
            type: [String],
            optional: true,
            label: "Car Registrations",
            max: 10,
            maxCount: 5
      },
     email: {
       type: [String],
       label: "Emails",
       regEx: SimpleSchema.RegEx.Email
     },
     location: {
       type: String,
       optional: true,
       label: "Location",
       max: 20
     },
     image: {
       type: String,
       optional: true,
       label: "Image",
       regEx: SimpleSchema.RegEx.Url
      },
      jobTitle: {
        type: String,
        optional: true,
        label: "Job Title",
        max: 30
      },
      department: {
        type: String,
        optional: true,
        label: "Department",
        max: 30,
        custom: function () {
          //if (this.value !== this.field('password').value) {
          //  return "passwordMismatch";
        }
      },
      contract: {
        type: String,
        optional: true,
        label: "Contract",
        regEx: SimpleSchema.RegEx.Id
      },
      //assesment, holiday, sick, observations, qualifications
      documents: {
        type: [String],
        optional: true,
        label: "Documents",
        regEx: SimpleSchema.RegEx.Id
      },
      supervisors:{
        type: [String],
        optional: true,
        label: "Supervisors",
        regEx: SimpleSchema.RegEx.Id
      },
      supervising: {
        type: [String],
        optional: true,
        label: "Supervising",
        regEx: SimpleSchema.RegEx.Id
      },
      assignedTasks: {
        type: [String],
        optional: true,
        label: "Assigned Tasks",
        regEx: SimpleSchema.RegEx.Id
      },
      currentTask: {
        type: String,
        optional: true,
        label: "Current Task",
        regEx: SimpleSchema.RegEx.Id
      },
      assets: {
        type: [String],
        optional: true,
        label: "Contract",
        regEx: SimpleSchema.RegEx.Id
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

//JS accessible helper functions
People.helperFunctions = {
  fullName : function(person){
  var name = person.forename + ' ';
  _.each(person.middlename, function(middlename){
    name = name + middlename + ' ';
  });
  return name + person.surname;
},
  fullAddress : function(person){
  return person.houseID + ' ' + person.street + ", " + person.city + ", " + person.county + ", " + person.country + ", "+ person.postCode;
},
  age : function(person){
  return moment().diff(person.dateOfBirth, 'years');
},
  daysSinceCreate : function(person){
  return moment.duration(-moment().diff(person.createdAt)).humanize(true);
}};

//Spacebars Helpers
People.helpers({
  fullName: function() {return People.helperFunctions.fullName(this);},
  fullAddress: function() {return People.helperFunctions.fullAddress(this);},
  age: function(){return People.helperFunctions.age(this);},
  daysSinceCreate: function(){return People.helperFunctions.daysSinceCreate(this);}  
});

People.simpleSchema().messages({
    'regEx email': "[label] is not a valid e-mail address"
});

People.allow({
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