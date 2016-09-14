angular
  .module('HomeworkApp')
  .controller("EventsShowController", EventsShowController);

EventsShowController.$inject = ["Event", "$state"];
function EventsShowController(Event, $state) {
  this.selected = Event.get($state.params);

  console.log(this.selected);

  this.delete = function() {
    this.selected.$remove(function() {
      $state.go("eventsIndex");
    });
  }
}