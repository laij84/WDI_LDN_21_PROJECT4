angular.module("HomeworkApp", ['ui.router', 'ngResource', 'angular-jwt', 'ngMessages', 'satellizer', 'ui.calendar'])
  .constant("API_URL", "http://localhost:3000/api")
  .config(Router)
  .config(oAuthConfig);


  oAuthConfig.$inject = ["$authProvider"];
  function oAuthConfig($authProvider) {
    
    $authProvider.facebook({
      url: "api/oauth/facebook",
      clientId: "1753104004957041"
    });

    $authProvider.github({
      url: "api/oauth/github",
      clientId: "95023e03ef010ac16b36"
    });

    $authProvider.twitter({
      url: "api/oauth/twitter",
      clientId: ""
    });

  }

  
Router.$inject = ["$stateProvider", "$urlRouterProvider"];

function Router($stateProvider, $urlRouterProvider){

  $stateProvider
    .state("home",{
      url: "/",
      templateUrl: "templates/home.html"
    })
    .state("register", {
      url:"/register",
      templateUrl: "templates/register.html",
      controller:"RegisterController as register"
    })
    .state("login", {
      url:"/login",
      templateUrl: "templates/login.html",
      controller:"LoginController as login"
    })
    .state("calendar", {
      url:"/calendar",
      templateUrl: "templates/calendar.html",
      controller:"CalendarController as calendar"
    });

    $urlRouterProvider.otherwise("/");
};



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
angular
  .module("HomeworkApp")
  .controller("LoginController", LoginController);

LoginController.$inject = ["User", "$state", "$rootScope", "$auth"];
function LoginController(User, $state, $rootScope, $auth) {
  var self = this;

  this.all = User.query();
  console.log(this.all[0]);

  this.credentials = {};

  this.authenticate = function(provider) {
    
    $auth.authenticate(provider)
      .then(function() {
        $rootScope.$broadcast("loggedIn");
        $state.go('home');
      }); 
  }

  this.submit = function() {
    $auth.login(this.credentials, {
      url: "/api/login"
    }).then(function(){
      $rootScope.$broadcast("loggedIn");
      $state.go('calendar');
      self.currentUser = $auth.getPayload();
      console.log(self.currentUser);
    })
  }

}





angular.module("HomeworkApp")
  .controller("MainController", MainController);

MainController.$inject = ["$state", "$rootScope", "$auth", "$window"];
function MainController($state, $rootScope, $auth, $window){
  var self = this;

  this.currentUser = $auth.getPayload();

  this.logout = function logout(){
    $auth.logout();
    this.currentUser = null;
    $state.go("home");
  }

  $rootScope.$on("loggedIn", function(){
    self.currentUser = $auth.getPayload();
    console.log(self.currentUser);
  });

  $rootScope.$on("unauthorized", function(){
    self.errorMessage = "You must be logged in!"
    $state.go("login");
  });

}
angular
  .module("HomeworkApp")
  .controller("RegisterController", RegisterController);

RegisterController.$inject = ["$auth", "$state", "$rootScope"]
function RegisterController($auth, $state, $rootScope) {
  
  this.user = {};

  this.submit = function() {
    $auth.signup(this.user, {
      url: "/api/register"
    })
    .then(function(){
      $rootScope.$broadcast("loggedIn");
      $state.go("login");
    });
  }
}
angular
  .module("HomeworkApp")
  .controller("UsersController", UsersController);

UsersController.$inject = ["User", "$auth"];
function UsersController(User, $auth) {
  this.all = User.query();

  this.currentUser = $auth.getPayload();
}
angular
  .module('HomeworkApp')
  .directive('date', date);

date.$inject = ['$window'];
function date($window) {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {
      element.on('keyup', function() {
        ngModel.$setViewValue($window.moment(new Date(this.value)));
      })
    }
  }
}
angular
  .module('HomeworkApp')
  .factory('Event', Event);

Event.$inject = ["$resource", "API_URL"];
function Event($resource, API_URL) {
  return $resource(API_URL + "/events/:id", { id: '@_id' }, {
    update: { method: "PUT" }
  });
}

angular
  .module('HomeworkApp')
  .factory('User', User);

User.$inject = ["$resource", "API_URL"];
function User($resource, API_URL) {
  return $resource(API_URL + "/users", { id: '@_id' }, {
    update: { method: "PUT" }
  });
}