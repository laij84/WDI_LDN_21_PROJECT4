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


