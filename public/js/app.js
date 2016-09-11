angular.module("HomeworkApp", ['ui.router', 'ngResource', 'angular-jwt', "ngMessages", "satellizer", "ui.calendar"])
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
angular
  .module("HomeworkApp")
  .controller("LoginController", LoginController);

LoginController.$inject = ["User", "$state", "$rootScope", "$auth"];
function LoginController(User, $state, $rootScope, $auth) {
  var self = this;
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
      $state.go('home');
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

UsersController.$inject = ["User"];
function UsersController(User) {
  this.all = User.query();
}
angular
  .module('HomeworkApp')
  .factory('Event', Event);

Event.$inject = ["$resource", "API_URL"];
function Event($resource, API_URL) {
  // return $resource(API_URL + "/users", { id: '@_id' }, {
  //   update: { method: "PUT" }
  // });
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