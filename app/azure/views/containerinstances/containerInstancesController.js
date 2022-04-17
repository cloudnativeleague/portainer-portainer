angular.module('portainer.azure').controller('AzureContainerInstancesController', [
  '$scope',
  '$state',
  'AzureService',
  'Notifications',
  function ($scope, $state, AzureService, Notifications) {
    function initView() {
      AzureService.subscriptions()
        .then(function success(data) {
          var subscriptions = data;
          return AzureService.containerGroups(subscriptions);
        })
        .then(function success(data) {
          $scope.containerGroups = AzureService.aggregate(data);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法加载容器组');
        });
    }

    $scope.deleteAction = function (selectedItems) {
      var actionCount = selectedItems.length;
      angular.forEach(selectedItems, function (item) {
        AzureService.deleteContainerGroup(item.Id)
          .then(function success() {
            Notifications.success('容器组移除成功', item.Name);
            var index = $scope.containerGroups.indexOf(item);
            $scope.containerGroups.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法移除容器组');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    };

    initView();
  },
]);
