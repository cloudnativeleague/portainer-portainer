angular.module('portainer.docker').controller('ConfigController', [
  '$scope',
  '$transition$',
  '$state',
  'ConfigService',
  'Notifications',
  function ($scope, $transition$, $state, ConfigService, Notifications) {
    $scope.removeConfig = function removeConfig(configId) {
      ConfigService.remove(configId)
        .then(function success() {
          Notifications.success('配置移出成功');
          $state.go('docker.configs', {});
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法移出配置');
        });
    };

    function initView() {
      ConfigService.config($transition$.params().id)
        .then(function success(data) {
          $scope.config = data;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索配置详情');
        });
    }

    initView();
  },
]);
