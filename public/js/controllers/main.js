angular.module("HomeworkApp")
  .controller("MainController", MainController);

MainController.$inject = ["TokenService", "$state", "$rootScope"];

function MainController(TokenService, $state, $rootScope){
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