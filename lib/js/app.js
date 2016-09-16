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


