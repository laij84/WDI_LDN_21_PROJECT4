angular.module("HomeworkApp")
  .controller("MainController", MainController);

MainController.$inject = ["$state", "$rootScope", "$auth", "$window"];
function MainController($state, $rootScope, $auth, $window){
  var self = this;

  this.currentUser = $auth.getPayload();

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

    console.log(toState);

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
    console.log(self.currentUser);
  });

  // $rootScope.$on("unauthorized", function(){
  //   self.errorMessage = "Invalid credentials. Please register or login.";
  //   console.log("401 received")
  //   $state.go("login");
  // });

}