(function () {
  'use strict';

  angular
    .module('otaRm')
    .controller('ReleasesListController', ReleasesListController)
    .controller('ReleasesDetailController', ReleasesDetailController);

  /** @ngInject */
  function ReleasesListController($uibModal, $log, $state, versionListService, toastr, moment, roleNav, rebackVersionService) {
    var vm = this;
    vm.maxSize = 5;
    vm.totalItems = 0;
    vm.currentPage = 1;

    vm.role = "OP";

    vm.versionList = {};
    vm.version = "";
    vm.type = "";

    // get list data
    var query = {
      role: vm.role
    };
    activate(query);

    function activate(query) {
      return getVersionList(query).then(function () {
        $log.info('LOG[vm.versionList]:', vm.versionList);

        vm.totalItems = vm.versionList.hasOwnProperty('count') ? vm.versionList.count : 0;
        $log.info('LOG[vm.totalItems]:', vm.totalItems);
      });
    }

    function getVersionList(query) {
      return versionListService.getVersionList(query).then(function (data) {
        vm.versionList = data;

        return vm.versionList;
      })
    };

    //pageChanged function
    vm.pageChanged = function () {
      $log.log('LOG[Page changed to]:', vm.currentPage);
      var query = {
        role: vm.role,
        pageIndex: vm.currentPage
      };
      activate(query);
    };

    // seach by version
    vm.search = function () {
      var query = {
        role: vm.role,
        versionname: vm.versionname
      };
      activate(query);
    };

    vm.stop = function(item){
      $log.info('LOG[item.versionname]:',item.versionname);
      var modalInstance  =  $uibModal.open({
        animation: true,
        templateUrl: 'app/releases/templates/rebackconfirm.template.html',
        controller: function($scope,$uibModalInstance, data,rebackVersionService){
          $scope.versionname = data.versionname;

          $scope.ok = function () {

            var query = {
              versionname :data.versionname,
              role : data.role,
              rtx : data.rtx
            };

            rebackVersionService.reback(query).then(function(data){
              $log.info('LOG[rebackVersionService]:',data);
              if(data.hasOwnProperty('err') && data.err === 0){
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.success(data.msg+' time:'+time,"Hello "+roleNav.ename);
                $uibModalInstance.close();
              }else{
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.error(data.msg+' time:'+time, "Hello "+roleNav.ename);
                $uibModalInstance.close();
              }

            })

          };

          $scope.cancel = function () {

            $uibModalInstance.dismiss('cancel');
          };
        },
        resolve: {
          data: function () {
            var tem= {
              versionname :item.versionname,
              role :vm.role,
              rtx :  roleNav.ename
            };
            return tem;
          }
        }
      });
    };

  }

  /** @ngInject */
  function ReleasesDetailController($uibModal, $log, $state, wecarListService, getVersionDetailService, toastr, moment, getSearchConditionService, roleNav) {
    var vm = this;
    vm.maxSize = 5;
    vm.totalItems = 0;
    vm.totalUpgradedItems = 0;
    vm.totalUnUpgradedItems = 0;
    vm.currentUpgradedPage = 1;

    vm.wecarList = {};
    vm.wecarUpgradedList = [];  //已升级该版本
    vm.wecarUpgradedListShow = [];
    vm.wecarUnUpgradedList = []; //未升级该版本
    vm.wecarUnUpgradedListShow = [];
    vm.versionDetail = {};
    vm.searchCondition = {};
    vm.wecarId = "";

    vm.role = "OP";

    // 选中的wecarId
    vm.wecarIdList = [];
    vm.all = false;
    vm.pageUpgradedNum = 0;
    vm.pageUnUpgradedNum = 0;

    // 检索条件
    vm.channel = "";
    vm.percent = "100";

    getVersionDetail($state.params.versionname);
    getSearchCondition();

    function getVersionDetail(versionname) {
      return getVersionDetailService.getVersionDetail(versionname).then(function (data) {
        vm.versionDetail = data.data;
        $log.log('LOG[vm.versionDetail]:', vm.versionDetail);
      })
    }

    function activate(query) {
      return getWecarList(query).then(function () {
        $log.log('LOG[vm.wecarList]:', vm.wecarList);

        vm.totalItems = vm.wecarList.hasOwnProperty('count') ? vm.wecarList.count : 0;
        vm.upgradedall = false;
        vm.unUpgradedAll = true;
        vm.wecarUpgradedList.splice(0, vm.wecarUpgradedList.length);
        vm.wecarUnUpgradedList.splice(0, vm.wecarUnUpgradedList.length);
        angular.forEach(vm.wecarList.data, function (item) {
          var wecarId = item._id;
            if (item.hasUpgrade == true) {
              vm.wecarUpgradedList.push(item);

            } else {
              vm.wecarUnUpgradedList.push(item);
            }
          $log.log('LOG[vm.totalItems]:', vm.totalItems);
        });

        angular.forEach(vm.wecarUpgradedList, function (item) {
          item.selected = vm.upgradedall;
        });

        angular.forEach(vm.wecarUnUpgradedList, function (item) {
          item.selected = vm.unUpgradedAll;
        });

        $log.log('LOG[vm.wecarUpgradedList]:', vm.wecarUpgradedList);

        vm.wecarUpgradedListShow = vm.wecarUpgradedList.slice(0, 10);
        vm.wecarUnUpgradedListShow = vm.wecarUnUpgradedList.slice(0, 10);
        vm.totalUpgradedItems = vm.wecarUpgradedList.length;
        vm.totalUnUpgradedItems = vm.wecarUnUpgradedList.length;

      });
    }

    function getWecarList(query) {
      return wecarListService.getWecarList(query).then(function (data) {
        vm.wecarList = data;
        return vm.wecarList;
      })
    }

    function getSearchCondition() {
      return getSearchConditionService.getSearchCondition().then(function (data) {
        vm.searchCondition.channel = data.data;
        $log.log('LOG[vm.searchCondition]:', vm.searchCondition);
      })
    }

    /*全选*/
    // todo 全选bug
    vm.checkUpgradedAll = function (e) {
      if (e.target.checked) {
        vm.pageUpgradedNum = vm.wecarUpgradedList.length;
        vm.upgradedall = true;
      } else {
        vm.pageUpgradedNum = 0;
        vm.upgradedall = false;
      }
      angular.forEach(vm.wecarUpgradedList, function (item) {
        item.selected = vm.upgradedall;
      });
      $log.log('LOG[vm.checkUpgradedAll]:', vm.checkUpgradedAll);
    };

    vm.thisUpgradedCheck = function (e, item) {
      if (e.target.checked) {
        item.selected = true;
        for (var upgradeitem in vm.wecarUpgradedList) {
          if (upgradeitem._id === item._id) {
            upgradeitem.selected = true;
            break;
          }
        }
        vm.pageUpgradedNum++;
        if (vm.pageUpgradedNum === vm.wecarUpgradedList.length) {
          vm.upgradedall = true;
        }
      } else {
        item.selected = false;
        for (var upgradeitem in vm.wecarUpgradedList) {
          if (upgradeitem._id === item._id) {
            upgradeitem.selected = false;
            break;
          }
        }
        vm.pageUpgradedNum--;
        vm.upgradedall = false;

      }
      $log.log('LOG[vm.thisUpgradedCheck]:', vm.thisUpgradedCheck);
    };


    vm.upgradedPageChanged = function () {
      $log.log('LOG[Page changed to]:', vm.currentUpgradedPage);
      vm.wecarUpgradedListShow = vm.wecarUpgradedList.slice((vm.currentUpgradedPage -1) * 10, vm.currentUpgradedPage * 10);
    };


    vm.checkUnUpgradedAll = function (e) {
      if (e.target.checked) {
        vm.pageUnUpgradedNum = vm.wecarUnUpgradedList.length;
        vm.unUpgradedAll = true;
      } else {
        vm.pageUnUpgradedNum = 0;
        vm.unUpgradedAll = false;
      }
      angular.forEach(vm.wecarUnUpgradedList, function (item) {
        item.selected = vm.unUpgradedAll;
      });
      $log.log('LOG[vm.checkUnUpgradedAll]:', vm.checkUnUpgradedAll);
    };

    vm.thisUnUpgradedCheck = function (e, item) {
      if (e.target.checked) {
        item.selected = true;
        for (var unupgradeitem in vm.wecarUnUpgradedList) {
          if (unupgradeitem._id === item._id) {
            unupgradeitem.selected = true;
            break;
          }
        }
        vm.pageUnUpgradedNum++;
        if (vm.pageUnUpgradedNum === vm.wecarUnUpgradedList.length) {
          vm.unUpgradedAll = true;
        }
      } else {
        item.selected = false;
        for (var unupgradeitem in vm.wecarUnUpgradedList) {
          if (unupgradeitem._id == item._id) {
            unupgradeitem.selected = false;
            break;
          }
        }
        vm.pageUnUpgradedNum--;
        vm.unUpgradedAll = false;

      }
      $log.log('LOG[vm.thisUnUpgradedCheck]:', vm.thisUnUpgradedCheck);
    };


    vm.unUpgradedPageChanged = function () {
      $log.log('LOG[Page changed to]:', vm.currentUpgradedPage);
      vm.wecarUnUpgradedListShow = vm.wecarUnUpgradedList.slice((vm.currentUnUpgradedPage - 1) * 10, vm.currentUnUpgradedPage * 10);
    };

    vm.release = function (module) {
      vm.wecarIdList.splice(0, vm.wecarIdList.length);

      angular.forEach(vm.wecarUnUpgradedList, function (item) {
        if (item.selected == true) {
          vm.wecarIdList.push(item._id);
        }
      });

      angular.forEach(vm.wecarUpgradedList, function (item) {
        if (item.selected == true) {
          vm.wecarIdList.push(item._id);
        }
      });


      $log.log('LOG[vm.wecarIdList]:', vm.wecarIdList);

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/selftest/templates/releaseAlert.html',
        controller: function ($scope, $uibModalInstance, items, $state, upgradeService) {
          $scope.data = items;
          $scope.ok = function () {
            upgradeService.upgrade(items).then(function (data) {
              $log.log('LOG[upgradeService]:', data);
              if (data.hasOwnProperty('err') && data.err === 0) {
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.success(data.msg + ' time:' + time, "Hello " + roleNav.ename);
                $uibModalInstance.close();
                vm.pageUnUpgradedNum = 0;
                vm.wecarIdList.length = 0;
                //$state.go('releases.list');
              } else {
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.error(data.msg + ' time:' + time, "Hello " + roleNav.ename);
                $uibModalInstance.close();
              }

            })

          };

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        },
        resolve: {
          items: function () {
            var data = {
              versionname: vm.versionDetail.versionname,
              wecarId: vm.wecarIdList,
              rtx: roleNav.ename
            };
            return data;
          }
        }
      });
    };

    // seach by wecarid
    vm.search = function () {
      vm.wecarIdList.length = 0;
      vm.pageUpgradedNum = 0;
      var query = {
        wecarId: vm.wecarId,
        versionname: vm.versionDetail.versionname
      };
      $log.log('LOG[vm.wecarId]:', vm.wecarId);
      activate(query);
    };

    // 检索
    vm.searching = function () {
      vm.wecarIdList.length = 0;
      vm.pageUpgradedNum = 0;
      var query = {
        channel: vm.channel,
        percent: vm.percent,
        versionname: vm.versionDetail.versionname
      };
      $log.log('LOG[vm.channel]:', vm.channel);
      $log.log('LOG[vm.percent]:', vm.percent);
      activate(query);
    }
  }
})();
