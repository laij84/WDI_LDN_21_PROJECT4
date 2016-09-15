angular
  .module('HomeworkApp')
  .controller("EventsEditController", EventsEditController);

EventsEditController.$inject = ["Event", "$state"];
function EventsEditController(Event, $state) {
  this.selected = Event.get($state.params);

  this.eventTypes = ['very productive', 'productive', 'unproductive', 'very unproductive'];

  console.log(this.selected);

  this.update = function() {
    this.selected.$update(function() {
      $state.go('eventsIndex', $state.params);
    });
  }
}