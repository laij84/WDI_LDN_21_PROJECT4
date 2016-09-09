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