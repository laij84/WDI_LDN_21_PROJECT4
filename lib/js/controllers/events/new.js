angular
  .module('HomeworkApp')
  .controller("EventsNewController", EventsNewController);

EventsNewController.$inject = ["Event", "$state", "$rootScope"];
function EventsNewController(Event, $state, $rootScope) {
  this.new = {};

  this.eventTypes = ['very productive', 'productive', 'unproductive', 'very unproductive'];

  this.create = function() {
    Event.save(this.new, function() {
      console.log("new event added");
      $state.go('eventsIndex');
    });
  }
}