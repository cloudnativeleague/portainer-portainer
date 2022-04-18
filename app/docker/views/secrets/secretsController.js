angular.module('portainer.docker').controller('SecretsController', [
  '$scope',
  '$state',
  'SecretService',
  'Notifications',
  function ($scope, $state, SecretService, Notifications) {
    $scope.removeAction = function (selectedItems) {
      var actionCount = selectedItems.length;
      angular.forEach(selectedItems, function (secret) {
        SecretService.remove(secret.Id)
          .then(function success() {
            Notifications.success('密钥移出成功', secret.Name);
            var index = $scope.secrets.indexOf(secret);
            $scope.secrets.splice(index, 1);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法移出密钥');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    };

    $scope.getSecrets = getSecrets;

    function getSecrets() {
      SecretService.secrets()
        .then(function success(data) {
          $scope.secrets = data;
        })
        .catch(function error(err) {
          $scope.secrets = [];
          Notifications.error('Failure', err, 'Unable to retrieve secrets');
        });
    }

    function initView() {
      getSecrets();
    }

    initView();
  },
]);
