angular.module('portainer.docker').controller('ServicesDatatableActionsController', [
  '$q',
  '$state',
  'ServiceService',
  'ServiceHelper',
  'Notifications',
  'ModalService',
  'ImageHelper',
  'WebhookService',
  function ($q, $state, ServiceService, ServiceHelper, Notifications, ModalService, ImageHelper, WebhookService) {
    const ctrl = this;

    this.scaleAction = function scaleService(service) {
      var config = ServiceHelper.serviceToConfig(service.Model);
      config.Mode.Replicated.Replicas = service.Replicas;
      ServiceService.update(service, config)
        .then(function success() {
          Notifications.success('服务扩容成功', '新的副本数量: ' + service.Replicas);
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法扩容服务');
          service.Scale = false;
          service.Replicas = service.ReplicaCount;
        });
    };

    this.removeAction = function (selectedItems) {
      ModalService.confirmDeletion('你想移除选中的服务吗?所有关联选中服务的容器也会被移除.', function onConfirm(confirmed) {
        if (!confirmed) {
          return;
        }
        removeServices(selectedItems);
      });
    };

    this.updateAction = function (selectedItems) {
      ModalService.confirmServiceForceUpdate('你想强制更新已选中的服务吗? 所有与这些服务相关的任务都会被重建.', function (result) {
        if (!result) {
          return;
        }
        var pullImage = false;
        if (result[0]) {
          pullImage = true;
        }
        forceUpdateServices(selectedItems, pullImage);
      });
    };

    function forceUpdateServices(services, pullImage) {
      var actionCount = services.length;
      angular.forEach(services, function (service) {
        var config = ServiceHelper.serviceToConfig(service.Model);
        if (pullImage) {
          config.TaskTemplate.ContainerSpec.Image = ImageHelper.removeDigestFromRepository(config.TaskTemplate.ContainerSpec.Image);
        }

        // As explained in https://github.com/docker/swarmkit/issues/2364 ForceUpdate can accept a random
        // value or an increment of the counter value to force an update.
        config.TaskTemplate.ForceUpdate++;
        ServiceService.update(service, config)
          .then(function success() {
            Notifications.success('服务更新成功', service.Name);
          })
          .catch(function error(err) {
            Notifications.error('F失败ailure', err, '无法强制更新服务' + service.Name);
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }

    function removeServices(services) {
      var actionCount = services.length;
      angular.forEach(services, function (service) {
        ServiceService.remove(service)
          .then(function success() {
            return WebhookService.webhooks(service.Id, ctrl.endpointId);
          })
          .then(function success(data) {
            return $q.when(data.length !== 0 && WebhookService.deleteWebhook(data[0].Id));
          })
          .then(function success() {
            Notifications.success('服务移除成功', service.Name);
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法移除服务');
          })
          .finally(function final() {
            --actionCount;
            if (actionCount === 0) {
              $state.reload();
            }
          });
      });
    }
  },
]);
