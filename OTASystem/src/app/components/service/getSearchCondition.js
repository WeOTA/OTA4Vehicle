(function(){
	'use strict';

	angular
		.module('otaRm')
		.factory('getSearchConditionService',getSearchConditionService);

	/** @ngInject */
	function getSearchConditionService($log,$http,API_HOST){
		var apiHost = API_HOST;

		var service = {
			apiHost : apiHost,
			getSearchCondition : getSearchCondition
		};

		return service;

		// fn getSearchCondition
		function getSearchCondition(){

			var apiParam = "/search/channel?callback=JSON_CALLBACK&output=jsonp";
			return $http.jsonp(apiHost+apiParam)
			.then(getSearchConditionComplete)
			.catch(getSearchConditionFailed);
			function getSearchConditionComplete(res){
				return res.data;
			}
			function getSearchConditionFailed(error){
				$log.error('XHR Failed for getSearchCondition.\n'+error.status)
			}
		}
	}
})();
