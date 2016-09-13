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
CalendarController.$inject = ["$resource", "$state", "$rootScope", "$auth", "Event"];

function CalendarController($resource, $state, $rootScope, $auth, Event) {

  var self = this;

  this.eventTypes = ['very productive', 'productive', 'unproductive', 'very unproductive']
  this.all = Event.query();

  this.new = {}

  this.create = function createEvent() {
    Event.save(self.new, function(event) {
      self.all.push(event);
      self.new = {};
      $('#addEventModal').modal('hide');
    });

  }

  this.selected = null;
  this.select = function selectEvent(event) {
    console.log(event);

    this.selected = Event.get({ id: event._id });
    
    console.log(this.selected);
  }

  this.update = function updateEvent() {
    console.log(this.selected);

    this.selected.$update(function(updatedEvent) {
      var index = self.all.findIndex(function(event) {
        return event._id === updatedEvent._id;
      });

      self.all.splice(index, 1, updatedEvent);
      self.selected = null;
    });

    $('#editEventModal').modal('hide');
  }

  this.delete = function deleteEvent(event) {
    event.$delete(function() {
      var index = self.all.indexOf(event);

      self.all.splice(index, 1);
    });
  }

  this.closeEditEventModal = function(){

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