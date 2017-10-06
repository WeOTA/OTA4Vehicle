(function () {
    'use strict';

    angular
        .module('otaRm')
        .factory('getReportInfoService', getReportInfoService);

    /** @ngInject */
    function getReportInfoService($log, $http, API_HOST) {
        var apiHost = API_HOST;

        var service = {
            apiHost: apiHost,
            getReportInfo: getReportInfo
        };

        return service;

        // fn getReportInfo
        function getReportInfo(versionname) {
            if (!versionname) {
                $log.error('versionname请求参数错误.');
                return;
            }

            var apiParam = "/search/report?callback=JSON_CALLBACK&output=jsonp&versionname=" + versionname;
            return $http.jsonp(apiHost + apiParam)
                .then(getReportInfoComplete)
                .catch(getReportInfoFailed);
            function getReportInfoComplete(res) {
                return res.data;
            }

            function getReportInfoFailed(error) {
                $log.error('XHR Failed for getReportInfo.\n' + error.status)
            }
        }
    }
})();
