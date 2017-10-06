(function() {
  'use strict';

  angular
    .module('otaRm')
    .controller('QamanualListController', QamanualListController)
    .controller('QamanualDetailController',QamanualDetailController);

  /** @ngInject */
  function QamanualListController($uibModal,$log,$state,versionListService,toastr,moment,roleNav) {
    var vm = this;

    //角色权限 后续从登录的接口中获取
    vm.role = "QA";
    vm.crole = roleNav.nav;

    // 分页参数
    vm.maxSize = 5;
    vm.totalItems = 0;
    vm.currentPage = 1;

    vm.versionList = {};
    vm.version = "";

    // get list data
    var query = {
      role:vm.role
    }
    activate(query);

    function activate(query){
      return getVersionList(query).then(function(){
        $log.info("LOG[versionList]:",vm.versionList);

        vm.totalItems =vm.versionList.hasOwnProperty('count') ? vm.versionList.count : 0 ;
        $log.info("LOG[totalItems]:",vm.totalItems);
      });
    };

    function getVersionList(query){
      return versionListService.getVersionList(query).then(function(data){
        vm.versionList = data;

        return vm.versionList;
      })
    };

    //pageChanged function
    vm.pageChanged = function() {
      $log.info("LOG[Page changed to]:", vm.currentPage);
      var query = {
        role : vm.role,
        pageIndex : vm.currentPage
      }
      activate(query);
    };

    //open save recad modal
    vm.open = function(version,module,name){

      var modalInstance  =  $uibModal.open({
        animation: true,
        templateUrl: 'app/qamanual/templates/reportText.html',
        controller: function($scope,$uibModalInstance, data,submitService,refuseService){
          $scope.isCollapsed = true;
          $scope.reportText = '';
          $scope.ok = function () {

            data.report = $scope.reportText;

            submitService.submit(data).then(function(data){
              $log.info("LOG[submitService]:",data)
              if(data.hasOwnProperty('err') && data.err === 0){
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.success(data.msg+' time:'+time,"Hello "+roleNav.ename);
                $uibModalInstance.close();
                $state.go('qamanual.list');
              }else{
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.error(data.msg+' time:'+time, "Hello "+roleNav.ename);
                $uibModalInstance.close();
              }

            })

          };

          // 打回
          $scope.refuse = function(){

            data.report = $scope.reportText;

            refuseService.refuse(data).then(function(data){
              $log.info("LOG[submitService]:",data)
              if(data.hasOwnProperty('err') && data.err === 0){
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.success(data.msg+' time:'+time,"Hello "+roleNav.ename);
                $uibModalInstance.close();
                $state.go('qamanual.list');
              }else{
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.error(data.msg+' time:'+time, "Hello "+roleNav.ename);
                $uibModalInstance.close();
              }

            })
          }

          $scope.cancel = function () {

            $uibModalInstance.dismiss('cancel');
          };
        },
        resolve: {
          data: function () {
            var item = {
              version :version,
              name : name,
              module : module,
              role :vm.role,
              rtx :roleNav.ename
            }
            return item;
          }
        }
      });
    };

    // seach by version
    vm.seach = function(){
      var query = {
        role:vm.role,
        version:vm.version
      };
      if(!vm.version){
        var query = {
          role:vm.role
        };
      }
      activate(query);
    };
  }

  /** @ngInject */
  function QamanualDetailController($uibModal,$log,$state,wecarListService,getVersionDetailService,toastr,moment,roleNav) {
    var vm = this;
    vm.maxSize = 5;
    vm.totalItems = 0;
    vm.currentPage = 1;

    vm.wecarList = {};
    vm.versionDetail = {};
    vm.wecarId = "";

    vm.role = "QA";


    // 选中的wecarId
    vm.wecarIdList =[];
    vm.all = false;
    vm.pageSelectedNum = 0;
    vm.package = 1;


    getVersionDetail($state.params.versionId);

    function getVersionDetail(versionId){
      return getVersionDetailService.getVersionDetail(versionId).then(function(data){
        vm.versionDetail = data.data
        $log.info("LOG[versionDetail]:",vm.versionDetail);

        //get wecarlist
        var query = {
          //company : vm.versionDetail.vendor,
          tasSysName:vm.versionDetail.tasSysName,
          level : 100,
          module : vm.versionDetail.module,
          version : vm.versionDetail.version,
          pageIndex : vm.currentPage
        }

        activate(query);
      })
    };

    function activate(query){
      return getWecarList(query).then(function(){
        $log.info("LOG[wecarList]:",vm.wecarList);
        vm.totalItems =  vm.wecarList.hasOwnProperty('count') ? vm.wecarList.count :0 ;
        vm.all = false;
        angular.forEach(vm.wecarList.data,function(item){
              var wecarId = item._id;
              if (vm.wecarIdList.indexOf(wecarId) != -1){
                  item.selected = true;
                  vm.pageSelectedNum++;
              } else {
                  item.selected = false;
              }
          });
          if(vm.pageSelectedNum === vm.wecarList.data.length){
              vm.all = true;
          }
        $log.info("LOG[totalItems]:",vm.totalItems);
      });
    };

    function getWecarList(query){
      return wecarListService.getWecarList(query).then(function(data){
        vm.wecarList = data;

        return vm.wecarList;
      })
    };

    /*全选*/
    // todo 全选bug
    vm.checkall = function(e){
      if(e.target.checked){
        vm.pageSelectedNum = vm.wecarList.data.length;
        angular.forEach(vm.wecarList.data,function(value,index) {
          if(value.hasOwnProperty('destTasSysVer') && value.destTasSysVer === vm.versionDetail.version){
            $log.info("LOG[destTasSysVer]:",value.destTasSysVer);
          }else{
              if (vm.wecarIdList.indexOf(value._id) == -1){
                  vm.wecarIdList.push(value._id);
              }
          }

        });
        vm.all = true;
      }else{
          vm.pageSelectedNum = 0;
          angular.forEach(vm.wecarList.data,function(value,index) {
              vm.wecarIdList.splice(vm.wecarIdList.indexOf(value._id),1);
          });
        vm.all = false;
      }
      angular.forEach(vm.wecarList.data,function(item){
        item.selected = vm.all;
      })
      $log.info("LOG[wecarIdList]:",vm.wecarIdList);
    }

    vm.thisCheck = function(e,wecarId){
        if(e.target.checked){
          vm.wecarIdList.push(wecarId);
          vm.pageSelectedNum++;
          if(vm.pageSelectedNum === vm.wecarList.data.length){
            vm.all = true;
          }
        }else{
          vm.wecarIdList.splice(vm.wecarIdList.indexOf(wecarId),1);
          vm.pageSelectedNum--;
          vm.all = false;

        }
        $log.info("LOG[wecarIdLis]:",vm.wecarIdList);
    };


    vm.pageChanged = function() {
        $log.info("LOG[Page changed to]:",vm.currentPage);
        vm.pageSelectedNum = 0;
        //vm.wecarIdList.length =0;
        var query = {
          level : 100,
          pageIndex : vm.currentPage,
          //company : vm.versionDetail.vendor,
          tasSysName:vm.versionDetail.tasSysName,
          module : vm.versionDetail.module,
          version : vm.versionDetail.version
        };
        activate(query);

      };

    vm.relase = function(module){
      $log.info("LOG[vm.package]:",vm.package)
      var modalInstance  =  $uibModal.open({
        animation: true,
        templateUrl: 'app/selftest/templates/releaseAlert.html',
        controller: function($scope,$uibModalInstance, items,$state,upgradeService){

          $scope.data = items;
          $scope.ok = function () {

            upgradeService.upgrade(items).then(function(data){
              $log.info("LOG[upgradeService]:",data)
              if(data.hasOwnProperty('err') && data.err === 0){
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.success(data.msg+' time:'+time,"Hello "+roleNav.ename);
                $uibModalInstance.close();
                  vm.pageSelectedNum = 0;
                  vm.wecarIdList.length = 0;
                //$state.go('qamanual.list');
              }else{
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.error(data.msg+' time:'+time,"Hello "+roleNav.ename);
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
              version:vm.versionDetail.version,
              name : vm.versionDetail.tasSysName,
              module : module,
              role : vm.role,
              level : 100,
              wecarId : vm.wecarIdList,
              type : vm.package,
              rtx :roleNav.ename
            }
            return data;
          }
        }
      });
    }

    // seach by version
    vm.seach = function(){
      vm.wecarIdList.length = 0;
      vm.pageSelectedNum = 0;
      var query = {
        module : vm.versionDetail.module,
        wecarId : vm.wecarId,
        version : vm.versionDetail.version
      }
      if(!vm.wecarId){
        query = {
          module : vm.versionDetail.module,
          level : 100,
          version : vm.versionDetail.version
        }
      }
      $log.info("LOG[wecarId]:",vm.wecarId)
      activate(query);
    };

  }
})();
