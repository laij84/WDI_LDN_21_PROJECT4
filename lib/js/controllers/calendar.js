angular.module("HomeworkApp")
  .controller("CalendarController", CalendarController);

//injection order must be same as the controller function argument order. 
CalendarController.$inject = ["$resource", "$state", "$rootScope", "uiCalendarConfig", "$auth", "Event"];

function CalendarController($resource, $state, $rootScope, uiCalendarConfig, $auth, Event) {
  var self = this;

  //Error when getting current user? $auth not a function error
  this.currentUser = $auth.getPayload();

  //Date variables
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  var h = date.getHours();

  //Event variables
  this.eventTypes = ['work', 'party'];
  this.selectedEvent = null;

  // events must be defined before eventSources
  this.events = Event.query();

console.log(this.events);

 //renders calendar with events when changing day/week/month views
   this.changeView = function(view,calendar) {
     uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
   };

   this.renderCalender = function(calendar) {
     if(uiCalendarConfig.calendars[calendar]){
       uiCalendarConfig.calendars[calendar].fullCalendar('render');
     }
   };

  this.eventValue = null;

  this.uiConfig = {
        calendar:{
          height: 450,
          editable: true,
          defaultView: "agendaDay",
          header:{
            left: 'agendaDay agendaWeek month',
            center: 'title',
            right: 'today prev,next'
          },
          eventClick: function(event){
            self.selectedEvent = event;
            console.log(self.selectedEvent.end.diff(self.selectedEvent.start, 'minutes'));
            console.log(self.selectedEvent);
          },
          eventDrop: self.alertOnDrop,
          eventResize: self.alertOnResize,
        }
      };

  this.eventSources = [this.events];

  //stick:true required to prevent event from being removed when switching months. 
  this.newEvent = {
    user: this.currentUser._id,
    stick: true }

  this.createEvent = function() {
    Event.save(this.newEvent, function() {
      self.events.push(self.newEvent);
    });
  }

  this.update = function() {
    self.selectedEvent.$update(function() {
      console.log(self.selectedEvent);
    });
  }

}