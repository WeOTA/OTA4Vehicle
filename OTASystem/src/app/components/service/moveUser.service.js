(function() {
	'use strict';

	angular
		.module('otaRm')
		.factory('moveUserService',moveUserService);

	/** @ngInject */
	function moveUserService($log, $http,API_HOST){
		var apiHost  = API_HOST;

		var service = {
			apiHost : apiHost,
			moveUser : moveUser
		};

		return service;
		//fn delete
		function moveUser(query){
      if (!query) {
        var apiParam = "/userType/relate?callback=JSON_CALLBACK&output=jsonp";
      } else {
        var apiParam = "/userType/relate?callback=JSON_CALLBACK&output=jsonp" +
          (query.hasOwnProperty('groupidx') ? "&groupidx=" + query.groupidx : "") +
          (query.hasOwnProperty('destwecarids') ? "&destwecarids=" + query.destwecarids : "") ;
      }
      return $http.jsonp(apiHost + apiParam)
        .then(moveUserComplete)
        .catch(moveUserFailed);
      function moveUserComplete(res) {
        return res.data;
      }

      function moveUserFailed(error) {
        $log.error('XHR Failed for moveUserFailed.\n' + error.status)
      }


		}
	}
})();
