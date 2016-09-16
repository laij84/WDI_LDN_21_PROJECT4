angular.module("HomeworkApp")
  .factory("AuthInterceptor", AuthInterceptor);

AuthInterceptor.$inject = ["API_URL", "$rootScope"];

//specific syntax for interceptor to work with Angular.
function AuthInterceptor(API_URL, $rootScope) {
  return {
    request: function(request) {
      return request;
      // console.log("auth", request);
    },

    response: function(response){
      // console.log("auth", response);
      return response;
    },
    responseError: function(response){
      if(response.status===401){
        // console.log("response Err", response);
        $rootScope.$broadcast("unauthorized");
      }
      return response.data; //need to return data
    }
  }
}