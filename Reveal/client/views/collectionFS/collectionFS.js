Template.imageList.images = function () {
        return Images.find();
    };


Template.imageList.events({
  'change .file-select': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function (err, fileObj) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        console.log("fileObj: " + fileObj + ", err: " + err);
        if(err)bootbox.alert(err.message);
      });
    });
  }
});