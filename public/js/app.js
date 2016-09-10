angular.module("HomeworkApp", ['ui.router', 'ngResource', 'angular-jwt', "ngMessages", "satellizer"])
  .constant("API_URL", "http://localhost:3000/api")
  .config(Router)
  .config(oAuthConfig);
  // .config(setupInterceptor);

  // setupInterceptor.$inject = ["$httpProvider"];

  // function setupInterceptor($httpProvider) {
  //   return $httpProvider.interceptors.push("AuthInterceptor");
  // }

  oAuthConfig.$inject = ["$authProvider"];
  function oAuthConfig($authProvider) {
    
    $authProvider.facebook({
      url: "api/oauth/facebook",
      clientId: "1753104004957041"
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
    });

    $urlRouterProvider.otherwise("/");
};



angular
  .module("HomeworkApp")
  .controller("LoginController", LoginController);

LoginController.$inject = ["User", "$state", "$rootScope", "$auth"];
function LoginController(User, $state, $rootScope, $auth) {

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

MainController.$inject = ["TokenService", "$state", "$rootScope", "$auth"];

function MainController(TokenService, $state, $rootScope, $auth){
  var self = this;

  this.currentUser = TokenService.decodeToken();

  this.logout = function logout(){
    TokenService.clearToken();
    this.currentUser = null;
    $state.go("home");
  }

  $rootScope.$on("loggedIn", function(){
    self.currentUser = TokenService.decodeToken();
  });

  $rootScope.$on("unauthorized", function(){
    self.errorMessage = "You must be logged in!"
    $state.go("login");
  });


}
angular
  .module("HomeworkApp")
  .controller("RegisterController", RegisterController);

RegisterController.$inject = ["User", "$state", "$rootScope"]
function RegisterController(User, $state, $rootScope) {
  
  this.user = {};

  this.submit = function() {
    User.register(this.user, function(response){
      $rootScope.$broadcast("loggedIn");
      $state.go("home");
    })
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
  .factory('User', User);

User.$inject = ["$resource", "API_URL"];
function User($resource, API_URL) {
  return $resource(API_URL + "/users", { id: '@_id' }, {
    update: { method: "PUT" },
    login: {method: "POST", url: API_URL +"/login"},
    register: {method: "POST", url: API_URL +"/register"}
  });
}
// angular.module("HomeworkApp")
//   .factory("AuthInterceptor", AuthInterceptor);

// AuthInterceptor.$inject = ["TokenService", "API_URL", "$rootScope"];

// //specific syntax for interceptor to work with Angular.
// function AuthInterceptor(TokenService, API_URL, $rootScope) {
//   return {
//     request: function(request) {
//       var token = TokenService.getToken();

//       if(!!request.url.match(API_URL) && token) {
//         request.headers.Authorization = "Bearer " + token;
//       }

//       return request;
//     },

//     response: function(response){
//       if(!!response.config.url.match(API_URL) && response.data.token) {
//         TokenService.setToken(response.data.token);
//       }

//       return response;
//     },

//     responseError: function(response){
//       if(response.status===401){
//         $rootScope.$broadcast("unauthorized");
//       }
//       return response.data; //need to return data
//     }
//   }
// }

angular.module("HomeworkApp")
  .service("TokenService", TokenService);

TokenService.$inject = ["$window", "jwtHelper"];

function TokenService($window, jwtHelper) {
  this.setToken = function setToken(token) {
    return $window.localStorage.setItem("token", token); //key and value
  }

  this.getToken = function getToken(){
    return $window.localStorage.getItem("token");
  }

  this.decodeToken = function decodeToken() {
    var token = this.getToken();
    return token ? jwtHelper.decodeToken(token) : null;
  } 

  this.clearToken = function clearToken() {
    return $window.localStorage.removeItem("token");
  }
}