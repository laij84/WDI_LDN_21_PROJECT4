angular
  .module("HomeworkApp")
  .controller("LoginController", LoginController);

LoginController.$inject = ["User", "$state", "$rootScope"];
function LoginController(User, $state, $rootScope) {

  this.credentials = {};

  this.submit = function submit() {
    if (this.form.$valid){
      User.login(this.credentials, function(response){
        $rootScope.$broadcast("loggedIn")
        $state.go("home");
      });
    }
  }
}