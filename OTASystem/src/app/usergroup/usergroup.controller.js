(function() {
  'use strict';

  angular
    .module('otaRm')
    .controller('UsergroupController', UsergroupController)
    .controller('UserlistController', UserlistController);

  /** @ngInject */
  function UsergroupController($log,$state,$uibModal,getSearchConditionService) {
    var vm = this;

    vm.searchCondition = {};
    vm.firstLevel = 100;

    vm.type = "";
    vm.systemName = 'all';
    vm.userlevel = 100;

    vm.productType = {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
      5: 'E'
    };

    vm.changeHint = function () {
      $log.log('LOG[changeHint to]:', vm.type);
      var query;
      if (vm.type == 1) {
          vm.systemName =  'A';
      } else if (vm.type == 2) {
        vm.systemName =  'B';
      } else if (vm.type == 3) {
        vm.systemName =  'C';
      } else if (vm.type == 4) {
        vm.systemName =  'D';
      }else if (vm.type == 5) {
        vm.systemName =  'E';
      }else {
        vm.systemName = 'all';
        return;
      }
      $state.go("usergroup.userlist",{level:vm.userlevel,tasSysName:vm.systemName});

    };

    getSearchCondition();
    function getSearchCondition(){
      return getSearchConditionService.getSearchCondition().then(function(data){
        vm.searchCondition = data.data;
        $log.info('LOG[vm.searchCondition]:',vm.searchCondition);

        if(vm.searchCondition && vm.searchCondition.userLevel){
          $state.go("usergroup.userlist",{level:vm.userlevel,tasSysName:vm.systemName});
        }

      })
    };


    vm.goList = function(level){
      $log.info('LOG[level]',level);
      vm.userlevel = level;
      $state.go("usergroup.userlist",{level:vm.userlevel,tasSysName:vm.systemName});
    }

  };
  /** @ngInject */
  function UserlistController($uibModal,$log,$state,toastr,wecarListService,getSearchConditionService,roleNav) {
    var vm = this;

    vm.maxSize = 5;
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.wecarId = "";

    vm.wecarList = {};
    // 选中的wecarId
    vm.wecarIdList =[];
    vm.all = false;
    vm.pageSelectedNum = 0;

    var query;
    $log.info('LOG[tasSysName]:',$state.params.tasSysName);
    $log.info('LOG[state.params.level]:',$state.params.level);

    if ($state.params.tasSysName != 'all') {
      query = {
        tasSysName: $state.params.tasSysName,
        level: $state.params.level
      }
    } else {
      query = {
        level: $state.params.level
      }
    }

    activate(query);
    function activate(query){
      return getWecarList(query).then(function(){
        $log.info('LOG[vm.wecarList]:',vm.wecarList);

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
        $log.log('LOG[vm.totalItems]:',vm.totalItems);
      });
    }

    function getWecarList(query){
      return wecarListService.getWecarList(query).then(function(data){
        vm.wecarList = data;

        return vm.wecarList;
      })
    }

    /*全选*/
    vm.checkall = function(e){
      if(e.target.checked){
        vm.pageSelectedNum = vm.wecarList.data.length;
        angular.forEach(vm.wecarList.data,function(value,index) {
          if (vm.wecarIdList.indexOf(value._id) == -1){
                  vm.wecarIdList.push(value._id);
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
      });
      $log.info('LOG[vm.wecarIdList]:',vm.wecarIdList);
    };

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
    };


    vm.pageChanged = function() {
        $log.log('LOG[Page changed to]:',vm.currentPage);
        vm.pageSelectedNum = 0;
        //vm.wecarIdList.length =0;
        var query = {
          level : $state.params.level,
          pageIndex : vm.currentPage
        }
        activate(query);

      };

      // seach by version
      vm.seach = function(){
        var query = {
          wecarId : vm.wecarId
        };
        if(!vm.wecarId){
          query = {
            level : $state.params.level
          }
        }
        $log.info('LOG[vm.wecarId]:',vm.wecarId);
        activate(query);
        vm.currentPage = 1;
      };

      vm.exportdata = function(tableid){
        var idTmr;
        if(getExplorer()=='ie')
        {
          var curTbl = document.getElementById(tableid);
          var oXL = new ActiveXObject("Excel.Application");

          //创建AX对象excel
          var oWB = oXL.Workbooks.Add();
          //获取workbook对象
          var xlsheet = oWB.Worksheets(1);
          //激活当前sheet
          var sel = document.body.createTextRange();
          sel.moveToElementText(curTbl);
          //把表格中的内容移到TextRange中
          sel.select();
          //全选TextRange中内容
          sel.execCommand("Copy");
          //复制TextRange中内容
          xlsheet.Paste();
          //粘贴到活动的EXCEL中
          oXL.Visible = true;
          //设置excel可见属性

          try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
          } catch (e) {
            print("Nested catch caught " + e);
          } finally {
            oWB.SaveAs(fname);

            oWB.Close(false);
            //xls.visible = false;
            oXL.Quit();
            oXL = null;
            //结束excel进程，退出完成
            //window.setInterval("Cleanup();",1);
            idTmr = window.setInterval("Cleanup();", 1);

          }

        }
        else
        {
          tableToExcel(tableid)
        }
      };


    function  getExplorer() {
      var explorer = window.navigator.userAgent ;
      //ie
      if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
      }
      //firefox
      else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
      }
      //Chrome
      else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
      }
      //Opera
      else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
      }
      //Safari
      else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
      }
    }

    function Cleanup() {
      window.clearInterval(idTmr);
      CollectGarbage();
    }
    var tableToExcel = (function() {
      var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function(s, c) {
          return s.replace(/{(\w+)}/g,
            function(m, p) { return c[p]; }) }
      return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
      }
    })()

      // 移动用户
      vm.moveUser = function(){
        var modalInstance  =  $uibModal.open({
          animation: true,
          templateUrl: 'app/usergroup/templates/moveUser.template.html',
          controller: function($scope,$uibModalInstance, data,$state,moveUserService){
            $log.info('LOG[data]:',data);
            $scope.searchCondition = data.searchCondition;
            $scope.destwecarids = data.destwecarids;
            $scope.toGroup = "";
            $scope.ok = function () {

              var query = {
                  groupidx : $scope.toGroup,
                  destwecarids :$scope.destwecarids
              };
              moveUserService.moveUser(query).then(function(data){
                $log.info('LOG[moveUserService]:',data);
                if(data.hasOwnProperty('err') && data.err === 0){
                  var time = moment(new Date().getTime()).format("LTS").toString();
                  toastr.success(data.msg+' time:'+time,"Hello "+roleNav.ename);
                  $uibModalInstance.close();
                  vm.pageSelectedNum = 0;
                  vm.wecarIdList.length = 0;
                  $state.go("usergroup.userlist",{level: query.groupidx});
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
            data: function () {
              return getSearchCondition();
              function getSearchCondition(){
                return getSearchConditionService.getSearchCondition().then(function(data){
                  var tem= {
                    searchCondition : data.data,
                    destwecarids :vm.wecarIdList,
                    level: $state.params.level,
                  }
                  return tem;
                })
              };

            }
          }
        });
      };
  }
})();
