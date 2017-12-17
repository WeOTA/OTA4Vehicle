(function () {
    'use strict';

    angular
        .module('otaRm')
        .controller('RdupdateController', RdupdateController)

    /** @ngInject */
    function RdupdateController($uibModal, $log, $state, toastr, Upload, getSearchConditionService, roleNav) {
        var vm = this;
        vm.role = "RD";
        vm.versionname = "";
        vm.versioncode = "";
        vm.buildnumber = "";
        vm.md5 = "";
        vm.description = "";

        vm.file = null;
        vm.progress = 0;

        vm.proChange = function () {
            vm.progress = 0;
        };

        vm.submit = function () {

            if (checkType(vm.versionname) == -1) {
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.error('版本号格式错误' + time, "Hello " + roleNav.ename);
                return;
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/rdupdate/templates/submit.template.html',
                controller: function ($scope, $uibModalInstance, data, API_HOST) {
                    var url = API_HOST + '/upload/submit';
                    $scope.data = data;
                    $scope.ok = function () {
                        $uibModalInstance.close();
                        Upload.upload({
                            url: url,
                            data: data
                        }).then(function (resp) {
                            if (resp.data.hasOwnProperty('err') && resp.data.err === 0) {
                                var time = moment(new Date().getTime()).format("LTS").toString();
                                toastr.success(resp.data.msg + ' time:' + time, "Hello " + roleNav.ename);
                            } else {
                                var time = moment(new Date().getTime()).format("LTS").toString();
                                toastr.error(resp.data.msg + ' time:' + time, "Hello " + roleNav.ename);
                            }
                        }, function (resp) {
                            var time = moment(new Date().getTime()).format("LTS").toString();
                            toastr.error(resp.data.msg + ' time:' + time, "Hello " + roleNav.ename);
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            $log.info('LOG[progress]:' + progressPercentage + '% ' + evt.config.data.file.name);
                            vm.progress = progressPercentage;
                        });
                    };

                    $scope.cancel = function () {

                        $uibModalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    data: function () {
                        var item = {
                            versionname: vm.versionname,
                            versioncode: vm.versioncode,
                            buildnumber: vm.buildnumber,
                            md5: vm.md5,
                            description: vm.description,
                            file: vm.file
                        }
                        return item;
                    }
                }
            });
        }

        function checkType(version) {
            // 支持三位或四位版本号，例如：2.0.6或者2.0.1.6
            if (!/^(([0-9]{1,})\.){2,3}([0-9]{1,})$/g.test(version)) {
                return -1;
            }
            return 1;
        }
    }

})();
