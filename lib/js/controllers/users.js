angular
  .module("HomeworkApp")
  .controller("UsersController", UsersController);

UsersController.$inject = ["User", "$auth"];
function UsersController(User, $auth) {
  this.all = User.query();

  this.currentUser = $auth.getPayload();
}