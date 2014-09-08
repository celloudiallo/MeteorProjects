Template.peopleTable.people = function(){
  return People.find();  
};

AutoForm.addHooks('btnDeletePerson', {
  before: {
      remove: function(docId, template) {
        var name = People.findOne(docId).fullName();
        bootbox.confirm('Do you really want to remove "' + name + '"?', function(result){
          if(result) { 
            People.remove(docId); 
          }
        });
        return false;
      }
    },
  });