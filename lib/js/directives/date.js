angular
  .module('HomeworkApp')
  .directive('date', date);

function date() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$formatters.push(function(value) {
        return new Date(value);
      });
    }
  }
}

// date.$inject = ['$window'];
// function date($window) {
//   return {
//     restrict: "A",
//     require: "ngModel",
//     link: function(scope, element, attrs, ngModel) {
//       element.on('keyup', function() {
//         ngModel.$setViewValue($window.moment(new Date(this.value)));
//       })
//     }
//   }
// }