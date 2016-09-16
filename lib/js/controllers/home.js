angular.module("HomeworkApp")
  .controller("HomeController", HomeController);

HomeController.$inject = ["$state", "$rootScope", "$auth"];
function HomeController($state, $rootScope, $auth){
  var self = this;

  this.currentUser = $auth.getPayload();

  $rootScope.$on("unauthorized", function(){
    self.errorMessage = "Invalid credentials. Please register or login.";
    console.log("401 received by Home Controller");
    console.log(self.errorMessage)
    $state.go("home");
  });

}