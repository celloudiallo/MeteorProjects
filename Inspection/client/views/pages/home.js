Template.home.rendered=function(){
  var img = this.$('.NISLogo')[0];
  var prevSrc = img.src;
  img.src = "";
  img.src = prevSrc;
};

Template.home.events({
  'click .NISLogo':function(event, template){
  var img = event.target;
  var prevSrc = img.src;
  img.src = "";
  img.src = prevSrc;
  }
});