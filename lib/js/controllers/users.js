angular
  .module("HomeworkApp")
  .controller("UsersController", UsersController);

UsersController.$inject = ["User", "$auth", "$rootScope"];
function UsersController(User, $auth, $rootScope) {
  var self = this;
  this.all = User.query();

  this.currentUser = $auth.getPayload();
  this.leaderboard = User.leaderboard();

  $rootScope.$on("UpdatedEvent", function(){
    self.leaderboard = User.leaderboard();
    console.log(self.leaderboard);
  });



  console.log(this.leaderboard);
}