navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

//Finds a forwards facing camera yo use (only on chrome)
var getSource = function(template){
  //Find a camera that is facing the environment or has no facing value
  var data = template.qrScan;
  data.videoSource = {error:true, id:'Didnt find any cameras'};
  if (MediaStreamTrack && MediaStreamTrack.getSources){
    MediaStreamTrack.getSources(function (sourceInfos) {
      for (var i = 0; i != sourceInfos.length; ++i) {
        var source = sourceInfos[i];
        if ((sourceInfos[i].kind === 'video') && ((source.facing === '')||(source.facing === 'environment')))
          data.videoSource = {error:false, id:source.id};
      }
      if (data.videoSource === null) data.videoSource = {error:true, id:'No suitable camera found'};
    });
  }
};

//Takes a snapshot and checks it for codes
var nextScan = function(){
  var template = this;
  var data = this.qrScan;
  if(!data.stream) return;
  var video = template.$('.videoOutput')[0];
  var canvas = template.$('.canvasOutput')[0];
  if(video && canvas && video.videoWidth && video.videoHeight){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    qrcode.imagedata = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
    qrcode.width = video.videoWidth;
    qrcode.height = video.videoHeight;
    template.$('.popup-qrscan').find('.modal-dialog').css({'width':(video.videoWidth + 32) +"px"});
    var value = null;
    try{ value = qrcode.process(ctx); } catch(e){}
    if(value){
      stopScan(null,template);
      template.$('.button-stop').trigger( "qrScan-complete", {value:value});
    }
  }
  clearTimeout(self.timer);
  self.timer = setTimeout($.proxy(nextScan, template), 1000);
}

//Sets up the scanning and schedules the scan interval
var startScan = function(event, template){
  template.$('.popup-qrscan').modal('show');
  var data = template.qrScan;
  if( typeof navigator.getUserMedia === 'function' && typeof window.requestAnimationFrame === 'function'){
    var errorCallback = function(e) {
      data.errorMsg = 'Cannot access video';
      data.errorMsgDep.changed();
    };
    var successCallback = function(stream) {
      
      var video = template.$('.videoOutput')[0];
      //Hook the video element up to the camera stream
      video.src = window.URL.createObjectURL(stream);
      video.play();
      //Store the stream so we can stop it later
      data.stream = stream;
      //Start a timer for the next scan
      clearTimeout(data.timer);
      data.timer = setTimeout($.proxy(nextScan, template), 1000);
      //Set the running property to true
      data.running = true;
      data.runningDep.changed();
    };
    
    if(!data.videoSource || data.videoSource.error){
      data.errorMsg = data.videoSource.id;
      data.errorMsgDep.changed();
    }
    //Set the max size of video
    var constraints = {video: {mandatory:{maxWidth:320,maxHeight:320}}};
    if(data.videoSource && !data.videoSource.error) constraints.video.optional = [{sourceId:data.videoSource.id}];
    navigator.getUserMedia(constraints, successCallback, errorCallback);
  }
  else{
    data.errorMsg = 'Video access not supported by this browser, get google chrome for best compatability';
    data.errorMsgDep.changed();
  }
};

//Stops the scanning
var stopScan = function(event, template){
  var data = template.qrScan;
  var video = template.$('.videoOutput')[0];
  template.$('.popup-qrscan').modal('hide');
  video.src = null;
  if(data.stream !== null) data.stream.stop();
  data.stream = null;
  data.timer = null;
  //Set the running property to true
  data.running = false;
  data.runningDep.changed();
};

Template.qrScan.rendered = function(){
}

Template.qrScan.created = function(){
  if(!this.qrScan) this.qrScan = {};
  this.qrScan.errorMsg = "";
  this.qrScan.errorMsgDep = new Deps.Dependency();
  this.qrScan.running = false;
  this.qrScan.runningDep = new Deps.Dependency();
  //Find the right camera to use, only works in chrome
  getSource(this);
};

Template.qrScan.events({
  'click .button-start' : function (event, template) {
    event.preventDefault();
    startScan(event, template);
  },
  'click .button-stop' : function (event, template) {
    event.preventDefault();
    stopScan(event, template);
  },
  'hidden.bs.modal' : function (event, template) {
    stopScan(event, template);
  }
});

Template.qrScan.helpers({
  source:null,
  errorMsg:function(){
    var template = UI._templateInstance();
    template.qrScan.errorMsgDep.depend();
    return template.qrScan.errorMsg;
  },
  running:function(){
    var template = UI._templateInstance();
    template.qrScan.runningDep.depend();
    return template.qrScan.running;
  }
});