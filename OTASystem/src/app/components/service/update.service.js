(function(){
    'use strict';

    angular
        .module('otaRm')
        .factory('updateService',updateService);
    /** @ngInject */
    function updateService($log,$http,API_HOST){
        var apiHost = API_HOST;

        var service = {
            apiHost : apiHost,
            update : update
        };

        return service;

        //fn update
        function update(query){
          if (!query) {
            var apiParam = "/version/update?callback=JSON_CALLBACK&output=jsonp";
          } else {
            var apiParam = "/version/update?callback=JSON_CALLBACK&output=jsonp" +
              (query.hasOwnProperty('versionname') ? "&versionname=" + query.versionname : "") +
              (query.hasOwnProperty('description') ? "&description=" + query.description : "") +
              (query.hasOwnProperty('role') ? "&role=" + query.role : "") +
              (query.hasOwnProperty('rtx') ? "&rtx=" + query.rtx : "");
          }
          return $http.jsonp(apiHost + apiParam)
            .then(updateComplete)
            .catch(updateFailed);
          function updateComplete(res) {
            return res.data;
          }

          function updateFailed(error) {
            $log.error('XHR Failed for updateFailed.\n' + error.status)
          }

        }
    }
})();
