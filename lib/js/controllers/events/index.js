angular.module("HomeworkApp")
  .controller("EventsIndexController", EventsIndexController);

//injection order must be same as the controller function argument order. 
EventsIndexController.$inject = ["$resource", "$state", "$rootScope", "$auth", "Event", "DateService"];

function EventsIndexController($resource, $state, $rootScope, $auth, Event, DateService) {

  var self = this;

//default cash values
  this.veryProductiveCount = 0;
  this.productiveCount = 0;
  this.unproductiveCount = 0;
  this.veryUnproductiveCount = 0;
  this.totalValue = 0;

//default percent values
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
    //cash value
    self.veryProductiveCount = 0;
    self.productiveCount = 0;
    self.unproductiveCount = 0;
    self.veryUnproductiveCount = 0;
    self.totalValue = 0;

    //percent values
    self.veryProductivePercent = 0;
    self.productivePercent = 0;
    self.unproductivePercent = 0;
    self.veryUnproductivePercent = 0;
  }

function calculateDayValue(){
  resetValues();
  self.all.$promise.then(function(events){

      for (i=0; i< events.length; i++){
        self.totalValue += events[i].duration;
        if(events[i].completed){
          if(events[i].category==="very productive"){
            self.veryProductiveCount += events[i].duration;
          }
          else if(events[i].category==="productive"){
            self.productiveCount += events[i].duration;
          }
          else if(events[i].category==="unproductive"){
            self.unproductiveCount += events[i].duration;
          }
          else if(events[i].category==="very unproductive"){
            self.veryUnproductiveCount += events[i].duration;
          }
        }
      }

    })
    .then(function(){
      self.veryProductivePercent = (self.veryProductiveCount / self.totalValue)*100;
      console.log(self.veryProductivePercent);

      self.productivePercent = (self.productiveCount / self.totalValue)*100;
      self.unproductivePercent = (self.unproductiveCount / self.totalValue)*100;
      self.veryUnproductivePercent = (self.veryUnproductiveCount / self.totalValue)*100;
    });
}

  this.selected = null;

  // this.select = function selectEvent(event) {
  //   this.selected = event;
  // }

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