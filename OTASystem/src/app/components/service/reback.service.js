(function() {
	'use strict';

	angular
		.module('otaRm')
		.factory('rebackVersionService',rebackVersionService);

	/** @ngInject */
	function rebackVersionService($log, $http,API_HOST){
		var apiHost  = API_HOST;

		var service = {
			apiHost : apiHost,
			reback : reback
		};

		return service;

		//reback
		function reback(query){

			if(!query.versionname){
				return $log.error('parame is error!')
			}
			var apiParam = "/version/recall?callback=JSON_CALLBACK&output=jsonp"+
				"&versionname="+query.versionname+"&rtx="+query.rtx;
			return $http.jsonp(apiHost+apiParam)
			.then(deleteComplete)
			.catch(deleteFailed);
			function deleteComplete(res){
				return res.data;
			}

			function deleteFailed(error){
				$log.error('XHR Failed for getVersionList.\n'+error.status)
			}
		}
	}
})();
