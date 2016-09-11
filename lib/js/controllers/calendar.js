angular.module("HomeworkApp")
  .controller("CalendarController", CalendarController);

CalendarController.$inject = ["$state", "$rootScope", "uiCalendarConfig"];

function CalendarController($state, $rootScope, uiCalendarConfig) {
  var self = this;

  //date variables
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  var h = date.getHours();

  //event variables
  this.selectedEvent = null;
  this.eventTypes = ['work', 'party']


  // var value = 10 * duration;
  // events must be defined before eventSources
  this.events = [
    {
      title: 'Happy Hour',
      start: new Date(y, m, d, h), 
      end: new Date(y, m, d, h+1), 
      type: this.eventTypes[1], 
      className: this.eventTypes[1]}
  ];

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

   this.alertOnEventClick = function( date, jsEvent, view){
       this.alertMessage = (date.title + ' was clicked ');
       console.log(this);
   };

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
            this.selectedEvent = event;
            console.log(this.selectedEvent);
            console.log(this.selectedEvent.title);
            console.log(this.selectedEvent.start);
            console.log(this.selectedEvent.end);
          },
          eventDrop: self.alertOnDrop,
          eventResize: self.alertOnResize,
        }
      };

  this.eventSources = [this.events];

  //stick:true required to prevent event from being removed when switching months. 
  this.newEvent = {stick: true}

  this.addEvent = function() {
    this.events.push(this.newEvent);
  };

self.alertEventOnClick = function( event, jsEvent, view ){
  console.log(event);
}

}