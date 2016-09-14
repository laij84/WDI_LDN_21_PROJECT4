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
      clientId: "LXg6LgZ4Nm3YO01C074vYih2G"
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

// date.$inject = ['$window'];
// function date($window) {
//   return {
//     restrict: "A",
//     require: "ngModel",
//     link: function(scope, element, attrs, ngModel) {
//       element.on('keyup', function() {
//         ngModel.$setViewValue($window.moment(new Date(this.value)));
//       })
//     }
//   }
// }
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
      $state.go('eventsShow', $state.params);
    });
  }
}
angular.module("HomeworkApp")
  .controller("EventsIndexController", EventsIndexController);

//injection order must be same as the controller function argument order. 
EventsIndexController.$inject = ["$resource", "$state", "$rootScope", "$auth", "Event", "DateService"];

function EventsIndexController($resource, $state, $rootScope, $auth, Event, DateService) {

  var self = this;

//default cash values
  this.veryProductiveCount = 0;
  this.productiveCount = 0;
  this.unproductiveCount = 0;
  this.veryUnproductiveCount = 0;
  this.totalValue = 0;

//default percent values
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
    //cash value
    self.veryProductiveCount = 0;
    self.productiveCount = 0;
    self.unproductiveCount = 0;
    self.veryUnproductiveCount = 0;
    self.totalValue = 0;

    //percent values
    self.veryProductivePercent = 0;
    self.productivePercent = 0;
    self.unproductivePercent = 0;
    self.veryUnproductivePercent = 0;
  }

function calculateDayValue(){
  resetValues();
  self.all.$promise.then(function(events){

      for (i=0; i< events.length; i++){
        self.totalValue += events[i].duration;
        if(events[i].completed){
          if(events[i].category==="very productive"){
            self.veryProductiveCount += events[i].duration;
          }
          else if(events[i].category==="productive"){
            self.productiveCount += events[i].duration;
          }
          else if(events[i].category==="unproductive"){
            self.unproductiveCount += events[i].duration;
          }
          else if(events[i].category==="very unproductive"){
            self.veryUnproductiveCount += events[i].duration;
          }
        }
      }

    })
    .then(function(){
      self.veryProductivePercent = (self.veryProductiveCount / self.totalValue)*100;
      console.log(self.veryProductivePercent);

      self.productivePercent = (self.productiveCount / self.totalValue)*100;
      self.unproductivePercent = (self.unproductiveCount / self.totalValue)*100;
      self.veryUnproductivePercent = (self.veryUnproductiveCount / self.totalValue)*100;
    });
}

  this.selected = null;

  // this.select = function selectEvent(event) {
  //   this.selected = event;
  // }

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