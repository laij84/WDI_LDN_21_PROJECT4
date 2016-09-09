angular.module("HomeworkApp")
  .factory("AuthInterceptor", AuthInterceptor);

AuthInterceptor.$inject = ["TokenService", "API_URL", "$rootScope"];

//specific syntax for interceptor to work with Angular.
function AuthInterceptor(TokenService, API_URL, $rootScope) {
  return {
    request: function(request) {
      var token = TokenService.getToken();

      if(!!request.url.match(API_URL) && token) {
        request.headers.Authorization = "Bearer " + token;
      }

      return request;
    },

    response: function(response){
      if(!!response.config.url.match(API_URL) && response.data.token) {
        TokenService.setToken(response.data.token);
      }

      return response;
    },

    responseError: function(response){
      if(response.status===401){
        $rootScope.$broadcast("unauthorized");
      }
      return response.data; //need to return data
    }
  }
}