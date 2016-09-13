angular.module("HomeworkApp")
  .controller("CalendarController", CalendarController);

//injection order must be same as the controller function argument order. 
CalendarController.$inject = ["$resource", "$state", "$rootScope", "$auth", "Event"];

function CalendarController($resource, $state, $rootScope, $auth, Event) {

  var self = this;

  this.eventTypes = ['very productive', 'productive', 'unproductive', 'very unproductive']
  this.all = Event.query();

  this.new = {}

  this.create = function createEvent() {
    Event.save(self.new, function(event) {
      self.all.push(event);
      self.new = {};
      $('#addEventModal').modal('hide');
    });

  }

  this.selected = null;
  this.select = function selectEvent(event) {
    console.log(event);

    this.selected = Event.get({ id: event._id });
    
    console.log(this.selected);
  }

  this.update = function updateEvent() {
    console.log(this.selected);

    this.selected.$update(function(updatedEvent) {
      var index = self.all.findIndex(function(event) {
        return event._id === updatedEvent._id;
      });

      self.all.splice(index, 1, updatedEvent);
      self.selected = null;
    });

    $('#editEventModal').modal('hide');
  }

  this.delete = function deleteEvent(event) {
    event.$delete(function() {
      var index = self.all.indexOf(event);

      self.all.splice(index, 1);
    });
  }

  this.closeEditEventModal = function(){

  }

  this.startDatetimepicker = function(){
    $('.start-datetimepicker').datetimepicker();
  }
  this.endDatetimepicker = function(){
    $('.end-datetimepicker').datetimepicker();
  }

}