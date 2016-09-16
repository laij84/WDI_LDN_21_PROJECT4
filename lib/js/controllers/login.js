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




