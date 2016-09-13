angular.module("HomeworkApp")
  .controller("CalendarController", CalendarController);

//injection order must be same as the controller function argument order. 
CalendarController.$inject = ["$resource", "$state", "$rootScope", "uiCalendarConfig", "$auth", "Event", "$compile"];

function CalendarController($resource, $state, $rootScope, uiCalendarConfig, $auth, Event, $compile) {
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
  this.eventTypes = ['very productive', 'productive', 'unproductive', 'very unproductive'];
  this.selectedEvent = null;

  // events must be defined before eventSources
  this.events = Event.query();

 //renders calendar with events when changing day/week/month views
  this.changeView = function(view,calendar) {
    uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
  };

  this.renderCalender = function(calendar) {
    if(uiCalendarConfig.calendars[calendar]){
      uiCalendarConfig.calendars[calendar].fullCalendar('render');
    }
  };

  this.eventRender = function( event, element, view ) {

      var eventClass = event.category.split(" ").join("");

       element.attr({ 'title': event.title,
                      'data-toggle': "tooltip"});
       element.addClass(eventClass);
       $compile(element)(self);
   };


   this.eventClick = function(event){
     self.selectedEvent = event;
     // console.log(self.selectedEvent.end.diff(self.selectedEvent.start, 'minutes'));
     console.log(self.selectedEvent);
     $('#editEventModal').modal("show");
   }

   this.consoleLog = function(){
    console.log("Is this working?");
   }


  this.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      defaultView: "agendaDay",
      scrollTime: '09:00:00',
      header:{
        left: 'agendaDay agendaWeek month',
        center: 'title',
        right: 'today prev,next'
      },
      eventClick: self.eventClick,
      eventDrop: self.consoleLog,
      eventResize: self.alertOnResize,
      eventRender: self.eventRender
    }
  };



  this.eventSources = [this.events];

  //stick:true required to prevent event from being removed when switching months. 
  this.newEvent = null;

  this.createEvent = function() {
    Event.save(this.newEvent, function() {
      self.events.push(self.newEvent);
    });
  }

  this.update = function() {
    var self = this;

    var event = {
      user: this.selectedEvent.user,
      title: this.selectedEvent.title,
      start: this.selectedEvent.start,
      end: this.selectedEvent.end,
      category: this.selectedEvent.category,
      value: this.selectedEvent.value,
      stick: this.selectedEvent.stick
    };

    Event.update({ id: this.selectedEvent._id }, event, function() {
      uiCalendarConfig.calendars.cal.fullCalendar('refetchEvents');
      self.selectedEvent = null;
    }, function(err){
      console.log(err);
    });
  }

  this.delete = function(event){
    //remove from events array
    var index = self.events.indexOf(event);
    console.log(index);
    self.events.splice(index, 1);

    //delete from database
    Event.delete({ id: this.selectedEvent._id }, function() {
      uiCalendarConfig.calendars.cal.fullCalendar('refetchEvents');
      self.selectedEvent = null;
    }, function(err){
      console.log(err);
    });
  }

  this.startDatetimepicker = function(){
    $('.start-datetimepicker').datetimepicker();
  }
  this.endDatetimepicker = function(){
    $('.end-datetimepicker').datetimepicker();
  }

}