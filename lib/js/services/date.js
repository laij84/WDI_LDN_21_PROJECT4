angular
  .module('HomeworkApp')
  .factory('DateService', DateService);

function DateService() {
  var today = new Date();

  today.setHours(0,0-today.getTimezoneOffset(),0,0);

  return {
    getToday: function() {
      return today;
    },
    getDaysFromToday: function(num) {
      var day = new Date(today);
      day.setHours(num*24, 0-day.getTimezoneOffset());

      return day;
    }
  }
}