angular.module("HomeworkApp")
  .controller("EventsIndexController", EventsIndexController);

//injection order must be same as the controller function argument order. 
EventsIndexController.$inject = ["$resource", "$state", "$rootScope", "$auth", "Event", "DateService"];

function EventsIndexController($resource, $state, $rootScope, $auth, Event, DateService) {

  var self = this;
//Count of completed events
  this.completedEventsCount = 0;
//total cash variable
  this.totalAmount = 0;

//default duration variables
  this.veryProductiveDuration = 0;
  this.productiveDuration = 0;
  this.unproductiveDuration = 0;
  this.veryUnproductiveDuration = 0;
  this.totalDuration = 0;

//default duration percent variables
  self.veryProductivePercent = 0;
  self.productivePercent = 0;
  self.unproductivePercent = 0;
  self.veryUnproductivePercent = 0;

  var daysFromToday = 0;
  this.currentDay = DateService.getDaysFromToday(daysFromToday);

  this.eventTypes = [ 'very productive', 
                      'productive', 
                      'unproductive', 
                      'very unproductive'];

  this.getDay = function(numberOfDays = 0) {
    daysFromToday += numberOfDays;
    this.currentDay = DateService.getDaysFromToday(daysFromToday);
    this.nextDay = DateService.getDaysFromToday(daysFromToday+1);
    getDaysEvents();
    calculateDayValue();
  }

  function getDaysEvents() {
    resetValues();
    self.all = Event.query({ start: self.currentDay, end: self.nextDay });
  }

  //populate calendar on pageload.
  this.getDay();

  function resetValues(){
    //count
    self.completedEventsCount = 0;
    //cash
    self.totalAmount = 0;
    //durations
    self.veryProductiveDuration = 0;
    self.productiveDuration = 0;
    self.unproductiveDuration = 0;
    self.veryUnproductiveDuration = 0;
    self.totalDuration = 0;

    //percent
    self.veryProductivePercent = 0;
    self.productivePercent = 0;
    self.unproductivePercent = 0;
    self.veryUnproductivePercent = 0;

    //chart
    self.dataSource = {
        chart: {
            caption: "How you spent your time",
            startingangle: "120",
            showlabels: "0",
            showlegend: "1",
            enablemultislicing: "0",
            slicingdistance: "15",
            showpercentvalues: "1",
            showpercentintooltip: "1",
            animateClockwise: "1",
            theme: "fint"
        },
        data: [
            {
                label: "No tasks",
                value: 100
            }
        ]
    }
  }


  self.dataSource = {
      chart: {
          caption: "How you spent your time",
          startingangle: "120",
          showlabels: "0",
          showlegend: "1",
          enablemultislicing: "0",
          slicingdistance: "15",
          showpercentvalues: "1",
          showpercentintooltip: "1",
          animateClockwise: "1",
          theme: "fint"
      },
      data: [
          {
              label: "No tasks",
              value: 100
          }
      ]
  }

function calculateDayValue(){
  resetValues();
  self.all.$promise.then(function(events){

      for (i=0; i< events.length; i++){
        self.totalDuration += events[i].duration;
        
        if(events[i].completed){
          self.completedEventsCount += 1;        
          self.totalAmount += events[i].value;

          if(events[i].category==="very productive"){
            self.veryProductiveDuration += events[i].duration;
          }
          else if(events[i].category==="productive"){
            self.productiveDuration += events[i].duration;
          }
          else if(events[i].category==="unproductive"){
            self.unproductiveDuration += events[i].duration;
          }
          else if(events[i].category==="very unproductive"){
            self.veryUnproductiveDuration += events[i].duration;
          }
        }
      }

    })
    .then(function(){
      self.veryProductivePercent = (self.veryProductiveDuration / self.totalDuration)*100;
      console.log(self.veryProductivePercent);

      self.productivePercent = (self.productiveDuration / self.totalDuration)*100;
      self.unproductivePercent = (self.unproductiveDuration / self.totalDuration)*100;
      self.veryUnproductivePercent = (self.veryUnproductiveDuration / self.totalDuration)*100;
    })
    .then(function(){
      if(self.all.length >= 1) {


      self.dataSource = {
          chart: {
              caption: "How you spent your time",
              startingangle: "120",
              showlabels: "0",
              showlegend: "1",
              enablemultislicing: "0",
              slicingdistance: "15",
              showpercentvalues: "1",
              showpercentintooltip: "1",
              theme: "fint",
              animateClockwise: "1"
          },
          data: [
              {
                  label: "Productive",
                  value: self.productivePercent
              },
              {
                  label: "Unproductive",
                  value: self.unproductivePercent
              },
              {
                  label: "Very Productive",
                  value: self.veryProductivePercent
              },
              {
                  label: "Very Unproductive",
                  value: self.veryUnproductivePercent
              }
          ]
      }
    } //end of if statement
      console.log(self.dataSource)
    });
}

  this.selected = null;

//Format minutes into user-friendly duration times
  this.formattedMinutes = null;

  this.formatMinutes = function(minutes){
    if(minutes < 60){
        self.formattedMinutes = (minutes) + 'm';        
      }
    else if(minutes%60==0){
        self.formattedMinutes = (minutes-minutes%60)/60 + 'h';        
      }
    else {
      self.formattedMinutes = ((minutes-minutes%60)/60 + 'h' + ' ' + minutes%60 + 'm');
      }
  }

//set class of event

  this.setEventClass= function (category) {
      if (category === "very productive") {
          return "veryproductive";
      } 
      else if (category === "productive") { 
          return "productive";
      } 
      else if (category === "unproductive") {
          return "unproductive";
      }
      else if (category === "very unproductive") {
          return "veryunproductive";
      }
  };

  this.setProgressClass = function (percent) {
      if (percent < 25) {
          return "progress-bar-danger";
      } 
      else if (percent < 50) { 
          return "progress-bar-warning";
      } 
      else if (percent < 75) {
          return "progress-bar-info";
      }
      else {
          return "progress-bar-success";
      }
  };
// UPDATE Event on Index Page
  this.update = function updateEvent(event) {
    this.selected = event;

    this.selected.$update(function(updatedEvent) {

      var index = self.all.findIndex(function(event) {
        return event._id === updatedEvent._id;
      });

      self.all.splice(index, 1, updatedEvent);
      self.selected = null;
    })
    .then(function(){
      calculateDayValue();
      $rootScope.$broadcast("UpdatedEvent");
    });
  }
    
  this.delete = function deleteEvent(event) {
    event.$delete(function() {
      console.log("deleted");
      var index = self.all.indexOf(event);

      self.all.splice(index, 1);
    });
  }

}