angular
  .module('HomeworkApp')
  .factory('Event', Event);

Event.$inject = ["$resource", "API_URL"];
function Event($resource, API_URL) {
  // return $resource(API_URL + "/users", { id: '@_id' }, {
  //   update: { method: "PUT" }
  // });
}