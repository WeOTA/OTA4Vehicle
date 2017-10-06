(function(){
	'use strict';

	angular
		.module('otaRm')
		.factory('getVersionDetailService',getVersionDetailService);

	/** @ngInject */
	function getVersionDetailService($log,$http,API_HOST){
		var apiHost = API_HOST;

		var service = {
			apiHost : apiHost,
			getVersionDetail : getVersionDetail
		};

		return service;

		// fn getVersionDetail
		function getVersionDetail(versionname){
			if(!versionname){
				$log.error('请求参数错误.');
				return ;
			}

			var apiParam = "/search/detail?callback=JSON_CALLBACK&output=jsonp&versionname="+versionname;
			return $http.jsonp(apiHost+apiParam)
			.then(getVersionDetailComplete)
			.catch(getVersionDetailFailed);
			function getVersionDetailComplete(res){
				return res.data;
			}
			function getVersionDetailFailed(error){
				$log.error('XHR Failed for getVersionDetail.\n'+error.status)
			}
		}
	}
})();
