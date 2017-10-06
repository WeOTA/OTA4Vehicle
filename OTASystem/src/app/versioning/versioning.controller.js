(function() {
  'use strict';

  angular
    .module('otaRm')
    .controller('VersioningListController', VersioningListController)
    .controller('VersioningDetailController',VersioningDetailController);

  /** @ngInject */
  function VersioningListController($uibModal,$log,$state,versionListService,toastr,moment,deleteVersionService,roleNav,rebackVersionService) {
    var vm = this;

    vm.maxSize = 5;
    vm.totalItems = 0;
    vm.currentPage = 1;

    vm.versionList = {};
    vm.versionname = "";
    vm.role = roleNav.nav;

    // get list data
    if(roleNav.nav === 'OP'){
      var query ={
        role :'OP'
      };
      activate(query);
    }else{
      activate();
    }


    function activate(query){
      return getVersionList(query).then(function(){
        $log.info('LOG[vm.versionList]:',vm.versionList);

        vm.totalItems =vm.versionList.hasOwnProperty('count') ? vm.versionList.count : 0 ;
        $log.info('LOG[vm.totalItems]:',vm.totalItems);
      });
    }

    function getVersionList(query){
      return versionListService.getVersionList(query).then(function(data){
        vm.versionList = data;

        return vm.versionList;
      })
    }

    //pageChanged function
    vm.pageChanged = function() {
      $log.log('Page changed to: ' + vm.currentPage);
      var query = {
        pageIndex : vm.currentPage
      };
      activate(query);
    };

    //无权删除
    vm.nodelete = function(){
      var modalInstance  =  $uibModal.open({
        animation: true,
        templateUrl: 'app/versioning/templates/nodelete.template.html',
        controller: function($scope,$uibModalInstance){

          $scope.cancel = function () {

            $uibModalInstance.dismiss('cancel');
          };
        }
      });
    };
    // seach by versionname
    vm.search = function(){
      if(!vm.versionname){
        activate();
      }else{
        var query = {
          versionname:vm.versionname
        };
        activate(query);
      }
      vm.currentPage = 1;
    };

    // delte
    vm.delete = function(item){
      $log.info('LOG[item.versionname]:',item.versionname);
      var modalInstance  =  $uibModal.open({
        animation: true,
        templateUrl: 'app/versioning/templates/confirm.template.html',
        controller: function($scope,$uibModalInstance, data,submitService){
          $scope.versionname = data.versionname;

          $scope.ok = function () {

            var query = {
              versionname :data.versionname,
               role : data.role,
               rtx : data.rtx
            };

            deleteVersionService.delete(query).then(function(data){
              $log.info('LOG[deleteVersionService]:',data);
              if(data.hasOwnProperty('err') && data.err === 0){
                var time = moment(new Date().getTime()).format("LTS").toString();
                toastr.success(data.msg+' time:'+time,"Hello "+roleNav.ename);
                $uibModalInstance.close();
                // 删除已经删除的项
                vm.versionList.data.splice(vm.versionList.data.indexOf(item),1);
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

      // update
      vm.update = function(item){
          var modalInstance  =  $uibModal.open({
              animation: true,
              templateUrl: 'app/versioning/templates/reportText.html',
              controller: function($scope, $uibModalInstance, data, updateService){
                  $log.info('LOG[description]:', data.description);
                  $scope.isCollapsed = false;
                  $scope.reportText = data.description;
                  $scope.ok = function () {
                      data.description = $scope.reportText;
                      updateService.update(data).then(function(data){
                          $log.info("LOG[updateService]:",data);
                          if(data.hasOwnProperty('err') && data.err === 0){
                              item.description = $scope.reportText;
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
                      var doc = {
                          versionname :item.versionname,
                          description : item.description,
                          role :vm.role,
                          rtx :roleNav.ename
                      };
                      return doc;
                  }
              }
          });
      };
  }
  /** @ngInject */
  function VersioningDetailController($state,$log,getReportInfoService){
    var vm = this;
    vm.reportInfo = {};
    $log.info("state.params",$state.params);
    getVersioningDetail($state.params.versionname);
    function getVersioningDetail(versionname){
      return getReportInfoService.getReportInfo(versionname).then(function(data){
          vm.reportInfo = data;
          return vm.reportInfo;
      })
    }

  }
})();
