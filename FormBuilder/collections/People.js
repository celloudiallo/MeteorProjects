// People -- data model
//Server collection

if (Meteor.isServer){
  People = new Meteor.Collection("people");
  People.allow({
    insert: function (userId, doc) {return true;},
    update: function (userId, docs, fields, modifier) {return true;},
    remove: function (userId, doc){return true;}
  });
  //Enable schema validation for this collection 
  People.deny(FormBuilder.validate("People"));
  //Add the created at timestamp on the server
  People.deny({
    insert: function(userId, doc) { 
      doc.createdAt = new Date().valueOf();
      doc.updatedAt = new Date().valueOf();
      return false;
    },
    update: function(userId, doc) {   
      doc.updatedAt = new Date().valueOf();
      return false;
    }
  });
}

//Client calculates some of the properties data templates can add to these
if(Meteor.isClient){
  People = new Meteor.Collection("people",{ 
    transform: function(doc){
      //Add computed fields
      var result = doc.name[0];
      _.each(doc.name[1], function(name){
        result += ' ' + name;
      });
      result += ' ' + doc.name[2];
     doc.fullName = result.trim();

      //Add computed fullAddress field
      /*doc.fullAddress =  doc.houseID + ' ' + doc.street + ", " + doc.city + ", " + doc.county + ", " + doc.country + ", "+ doc.postCode;
      doc.daysSinceCreate = moment.duration(-moment().diff(this.createdAt)).humanize(true);*/
      return doc;
    }
  });
}

//Server and client need to see the same schema
People.schema = {
  clockNumber: {
    controller: 'fbControllerNumber',
    view: 'fbViewNumber',
    labelText: "Clock Number",
    unique: true,
    asYouType: true,
    //Specific
    minValue: 1000,
    maxValue: 9999,
    places:1
  },
  name: {
    controller: 'fbControllerPersonName',
    view: 'fbViewPersonName',
    labelText: 'Name',
    forenameTxt: 'Forname',
    surnameTxt: 'Surname',
    middlenamesTxt: 'Middle Names',
    controllerText: 'fbControllerText',
    viewText: 'fbViewText',
    controllerArray: 'fbControllerArray',
    viewArray: 'fbViewArray'
  },
  dateOfBirth: {
    controller: 'fbControllerDob',
    view: 'fbViewDob',
    labelText: {create:"Date of Birth", read:"Age"},
    //Specific
    maxAge: 90,
    minAge: 10
  },
  dateJoined: {
    controller: 'fbControllerDate',
    view: 'fbViewDate',
    labelText: "Date of employment",
    optional: true,
    //Specific
    minValue: '1920-01-01',
    maxValue: moment().format('YYYY-MM-DD')
  },
  address: {
    controller: 'fbControllerAddress',
    view: 'fbViewAddress',
    labelText: 'Address',
    showOrganisation: false,
    buildingTxt: 'Building Name/Number',
    streetTxt: 'Street Name',
    townTxt: 'City/Town',
    postCodeTxt: 'Post Code',
    countryTxt: 'Country',
    countriesDataSource:'Countries.name',
    countriesPlaceholder:'Select Country'
  },
  department:{
    controller: 'fbControllerTypeahead',
    view: 'fbViewTypeahead',
    labelText: "Department",
    optional: true,
    //Specific
    dataSource:'Departments.name',
    placeholder:'Select Department'
  }/*,
  code: {
    controller: 'fbControllerQRCode',
    labelText: 'Code',
    optional: false,
    //Specific
    maxLength: 50,
    minLength: 10
  },
  country: {
    controller: 'fbControllerTypeahead',
    view: 'fbViewTypeahead',
    labelText: 'Country',
    optional: true,
    asYouType: true,
    //Specific
    dataSource: 'Countries.name',
    placeholder: 'Select Country'
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
     */
};