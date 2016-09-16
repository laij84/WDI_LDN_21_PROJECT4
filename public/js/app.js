angular.module("HomeworkApp", ['ui.router', 'ngResource', 'angular-jwt', 'ngMessages', 'satellizer', 'angularjs-datetime-picker', 'ng-fusioncharts'])
  .constant("API_URL", "/api")
  .config(Router)
  .config(setupInterceptor)
  .config(oAuthConfig);

  setupInterceptor.$inject = ["$httpProvider"];

  function setupInterceptor($httpProvider) {
    return $httpProvider.interceptors.push("AuthInterceptor");
  }


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
      clientId: "LXg6LgZ4Nm3YO01C074vYih2G"
    });

  }

  
Router.$inject = ["$stateProvider", "$urlRouterProvider"];

function Router($stateProvider, $urlRouterProvider){

  $stateProvider
    .state("home",{
      url: "/",
      templateUrl: "templates/home.html",
      controller: "HomeController as home"
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
    .state("eventsIndex", {
      url:"/events",
      templateUrl: "templates/events/index.html",
      controller:"EventsIndexController as eventsIndex"
    })
    .state("eventsNew", {
      url:"/events/new",
      templateUrl: "templates/events/new.html",
      controller:"EventsNewController as eventsNew"
    })
    .state("eventsShow", {
      url:"/events/:id",
      templateUrl: "templates/events/show.html",
      controller:"EventsShowController as eventsShow"
    })
    .state("eventsEdit", {
      url:"/events/:id/edit",
      templateUrl: "templates/events/edit.html",
      controller:"EventsEditController as eventsEdit"
    });

    $urlRouterProvider.otherwise("/");
};



angular.module("HomeworkApp")
  .controller("HomeController", HomeController);

HomeController.$inject = ["$state", "$rootScope", "$auth"];
function HomeController($state, $rootScope, $auth){
  var self = this;

  this.currentUser = $auth.getPayload();

  $rootScope.$on("unauthorized", function(){
    self.errorMessage = "Invalid credentials. Please register or login.";
    // console.log("401 received by Home Controller");
    // console.log(self.errorMessage);
    $state.go("home");
  });

}
angular
  .module("HomeworkApp")
  .controller("LoginController", LoginController);

LoginController.$inject = ["User", "$state", "$rootScope", "$auth"];
function LoginController(User, $state, $rootScope, $auth) {
  var self = this;

  this.currentUser = $auth.getPayload();
  this.all = User.query();

  this.credentials = {};

  this.authenticate = function(provider) {
    
    $auth.authenticate(provider)
      .then(function() {
        $rootScope.$broadcast("loggedIn");
        $state.go('eventsIndex');
      }); 
  }

  this.submit = function() {
    $auth.login(this.credentials, {
      url: "/api/login"
    }).then(function(){
      $rootScope.$broadcast("loggedIn");
      $state.go('eventsIndex');
      self.currentUser = $auth.getPayload();
      console.log(self.currentUser);
    })
  }

  $rootScope.$on("loggedOut", function(){
    self.currentUser = null;
    console.log(self.currentUser);
  });

}





angular.module("HomeworkApp")
  .controller("MainController", MainController);

MainController.$inject = ["$state", "$rootScope", "$auth", "$window"];
function MainController($state, $rootScope, $auth, $window){
  var self = this;

  this.currentUser = $auth.getPayload();

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

    // console.log(toState);

    if(!self.currentUser && ['home', 'login', 'register'].indexOf(toState.name) == -1 ){
      e.preventDefault();
      $state.go('home');
    }
  });


  this.logout = function logout(){
    $auth.logout();
    console.log("logged out")
    this.currentUser = null;
    $state.go("home");
    $rootScope.$broadcast("loggedOut");
  }

  $rootScope.$on("loggedIn", function(){
    self.currentUser = $auth.getPayload();
    // console.log(self.currentUser);
  });

  // $rootScope.$on("unauthorized", function(){
  //   self.errorMessage = "Invalid credentials. Please register or login.";
  //   console.log("401 received")
  //   $state.go("login");
  // });

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

UsersController.$inject = ["User", "$auth", "$rootScope"];
function UsersController(User, $auth, $rootScope) {
  var self = this;
  this.all = User.query();

  this.currentUser = $auth.getPayload();
  this.leaderboard = User.leaderboard();

  $rootScope.$on("UpdatedEvent", function(){
    self.leaderboard = User.leaderboard();
    // console.log(self.leaderboard);
  });

  // console.log(this.leaderboard);
}
angular
  .module('HomeworkApp')
  .directive('date', date);

function date() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$formatters.push(function(value) {
        return new Date(value);
      });
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
    update: { method: "PUT" },
    leaderboard: { method: "GET", url: "api/users/leaderboard", isArray: true }
  });
}
angular.module("HomeworkApp")
  .factory("AuthInterceptor", AuthInterceptor);

AuthInterceptor.$inject = ["API_URL", "$rootScope"];

//specific syntax for interceptor to work with Angular.
function AuthInterceptor(API_URL, $rootScope) {
  return {
    request: function(request) {
      return request;
      // console.log("auth", request);
    },

    response: function(response){
      // console.log("auth", response);
      return response;
    },
    responseError: function(response){
      if(response.status===401){
        // console.log("response Err", response);
        $rootScope.$broadcast("unauthorized");
      }
      return response.data; //need to return data
    }
  }
}
angular
  .module('HomeworkApp')
  .factory('DateService', DateService);

function DateService() {
  var today = new Date();

  today.setHours(0,0-today.getTimezoneOffset(),0,0);

  return {
    getToday: function() {
      return today;
    },
    getDaysFromToday: function(num) {
      var day = new Date(today);
      day.setHours(num*24, 0-day.getTimezoneOffset());

      return day;
    }
  }
}
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
angular.module("HomeworkApp")
  .controller("EventsIndexController", EventsIndexController);

//injection order must be same as the controller function argument order. 
EventsIndexController.$inject = ["$resource", "$state", "$rootScope", "$auth", "Event", "DateService"];

function EventsIndexController($resource, $state, $rootScope, $auth, Event, DateService) {

  var self = this;
//Count of completed events
  this.completedEventsCount = 0;
//total cash variable
  this.totalAmount = 0;

//default duration variables
  this.veryProductiveDuration = 0;
  this.productiveDuration = 0;
  this.unproductiveDuration = 0;
  this.veryUnproductiveDuration = 0;
  this.totalDuration = 0;

//default duration percent variables
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
    //count
    self.completedEventsCount = 0;
    //cash
    self.totalAmount = 0;
    //durations
    self.veryProductiveDuration = 0;
    self.productiveDuration = 0;
    self.unproductiveDuration = 0;
    self.veryUnproductiveDuration = 0;
    self.totalDuration = 0;

    //percent
    self.veryProductivePercent = 0;
    self.productivePercent = 0;
    self.unproductivePercent = 0;
    self.veryUnproductivePercent = 0;

    //chart
    self.dataSource = {
        chart: {
            caption: "How you spent your time",
            startingangle: "120",
            showlabels: "0",
            showlegend: "1",
            enablemultislicing: "0",
            slicingdistance: "15",
            showpercentvalues: "1",
            showpercentintooltip: "1",
            animateClockwise: "1",
            theme: "fint"
        },
        data: [
            {
                label: "No tasks",
                value: 100
            }
        ]
    }
  }


  self.dataSource = {
      chart: {
          caption: "How you spent your time",
          startingangle: "120",
          showlabels: "0",
          showlegend: "1",
          enablemultislicing: "0",
          slicingdistance: "15",
          showpercentvalues: "1",
          showpercentintooltip: "1",
          animateClockwise: "1",
          theme: "fint"
      },
      data: [
          {
              label: "No tasks",
              value: 100
          }
      ]
  }

function calculateDayValue(){
  resetValues();
  self.all.$promise.then(function(events){

      for (i=0; i< events.length; i++){
        self.totalDuration += events[i].duration;
        
        if(events[i].completed){
          self.completedEventsCount += 1;        
          self.totalAmount += events[i].value;

          if(events[i].category==="very productive"){
            self.veryProductiveDuration += events[i].duration;
          }
          else if(events[i].category==="productive"){
            self.productiveDuration += events[i].duration;
          }
          else if(events[i].category==="unproductive"){
            self.unproductiveDuration += events[i].duration;
          }
          else if(events[i].category==="very unproductive"){
            self.veryUnproductiveDuration += events[i].duration;
          }
        }
      }

    })
    .then(function(){
      self.veryProductivePercent = (self.veryProductiveDuration / self.totalDuration)*100;
      console.log(self.veryProductivePercent);

      self.productivePercent = (self.productiveDuration / self.totalDuration)*100;
      self.unproductivePercent = (self.unproductiveDuration / self.totalDuration)*100;
      self.veryUnproductivePercent = (self.veryUnproductiveDuration / self.totalDuration)*100;
    })
    .then(function(){
      if(self.all.length >= 1) {


      self.dataSource = {
          chart: {
              caption: "How you spent your time",
              startingangle: "120",
              showlabels: "0",
              showlegend: "1",
              enablemultislicing: "0",
              slicingdistance: "15",
              showpercentvalues: "1",
              showpercentintooltip: "1",
              theme: "fint",
              animateClockwise: "1"
          },
          data: [
              {
                  label: "Productive",
                  value: self.productivePercent
              },
              {
                  label: "Unproductive",
                  value: self.unproductivePercent
              },
              {
                  label: "Very Productive",
                  value: self.veryProductivePercent
              },
              {
                  label: "Very Unproductive",
                  value: self.veryUnproductivePercent
              }
          ]
      }
    } //end of if statement
      console.log(self.dataSource)
    });
}

  this.selected = null;

//Format minutes into user-friendly duration times
  this.formattedMinutes = null;

  this.formatMinutes = function(minutes){
    if(minutes < 60){
        self.formattedMinutes = (minutes) + 'm';        
      }
    else if(minutes%60==0){
        self.formattedMinutes = (minutes-minutes%60)/60 + 'h';        
      }
    else {
      self.formattedMinutes = ((minutes-minutes%60)/60 + 'h' + ' ' + minutes%60 + 'm');
      }
  }

//set class of event

  this.setEventClass= function (category) {
      if (category === "very productive") {
          return "veryproductive";
      } 
      else if (category === "productive") { 
          return "productive";
      } 
      else if (category === "unproductive") {
          return "unproductive";
      }
      else if (category === "very unproductive") {
          return "veryunproductive";
      }
  };

  this.setProgressClass = function (percent) {
      if (percent < 25) {
          return "progress-bar-danger";
      } 
      else if (percent < 50) { 
          return "progress-bar-warning";
      } 
      else if (percent < 75) {
          return "progress-bar-info";
      }
      else {
          return "progress-bar-success";
      }
  };
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
      $rootScope.$broadcast("UpdatedEvent");
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