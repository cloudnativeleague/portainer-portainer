import sanitize from 'sanitize-html';
import bootbox from 'bootbox';

import { applyBoxCSS, ButtonsOptions, confirmButtons } from './utils';

type ConfirmCallback = (confirmed: boolean) => void;

interface ConfirmAsyncOptions {
  title: string;
  message: string;
  buttons: ButtonsOptions;
}

interface ConfirmOptions extends ConfirmAsyncOptions {
  callback: ConfirmCallback;
}

export function confirmWebEditorDiscard() {
  const options = {
    title: '确定吗？',
    message: '您当前在编辑器中有未保存的更改。你确定要离开吗？',
    buttons: {
      confirm: {
        label: '是',
        className: 'btn-danger',
      },
    },
  };
  return new Promise((resolve) => {
    confirm({
      ...options,
      callback: (confirmed) => resolve(confirmed),
    });
  });
}

export function confirmAsync(options: ConfirmAsyncOptions) {
  return new Promise((resolve) => {
    confirm({
      ...options,
      callback: (confirmed) => resolve(confirmed),
    });
  });
}

export function confirm(options: ConfirmOptions) {
  const box = bootbox.confirm({
    title: options.title,
    message: options.message,
    buttons: confirmButtons(options.buttons),
    callback: options.callback,
  });

  applyBoxCSS(box);
}

export function confirmAccessControlUpdate(callback: ConfirmCallback) {
  confirm({
    title: '确定吗？',
    message: '更改此资源的所有权可能会将其管理限制为某些用户。',
    buttons: {
      confirm: {
        label: '改变所有者',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function confirmImageForceRemoval(callback: ConfirmCallback) {
  confirm({
    title: '确定吗？',
    message: '强制删除镜像将删除镜像，即使它有多个标记或被停止的容器使用。',
    buttons: {
      confirm: {
        label: '删除镜像',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function cancelRegistryRepositoryAction(callback: ConfirmCallback) {
  confirm({
    title: '确定吗？',
    message:
      '警告：在操作完成之前中断此操作将导致所有标签丢失。你确定要这么做吗？',
    buttons: {
      confirm: {
        label: '停止',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function confirmDeletion(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);
  confirm({
    title: '确定吗？',
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '删除',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function confirmDetachment(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);
  confirm({
    title: '确定吗？',
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '断开',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function confirmDeassociate(callback: ConfirmCallback) {
  const message =
    '<p>解除此边缘环境的关联会将其标记为非关联，并清除已注册的边缘ID。</p>' +
    '<p>任何使用与此环境关联的边缘密钥启动的代理都将能够与此环境重新关联。</p>' +
    '<p>可以重复使用用于部署现有边缘代理的边缘ID和边缘密钥，以将新的边缘设备与此环境关联。</p>';
  confirm({
    title: '关于解除关联',
    message: sanitize(message),
    buttons: {
      confirm: {
        label: '解除关联',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function confirmUpdate(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);

  confirm({
    title: '确定吗？',
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '更新',
        className: 'btn-warning',
      },
    },
    callback,
  });
}

export function confirmRedeploy(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);

  confirm({
    title: '',
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '重新部署应用程序',
        className: 'btn-primary',
      },
      cancel: {
        label: '稍后再做',
      },
    },
    callback,
  });
}

export function confirmDeletionAsync(message: string) {
  return new Promise((resolve) => {
    confirmDeletion(message, (confirmed) => resolve(confirmed));
  });
}

export function confirmEndpointSnapshot(callback: ConfirmCallback) {
  confirm({
    title: '确定吗？',
    message: '触发手动刷新将轮询每个环境以检索其信息，这可能需要一些时间。',
    buttons: {
      confirm: {
        label: '继续',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function confirmImageExport(callback: ConfirmCallback) {
  confirm({
    title: '注意',
    message: '导出可能需要几分钟时间，在导出过程中不要离开。',
    buttons: {
      confirm: {
        label: '继续',
        className: 'btn-primary',
      },
    },
    callback,
  });
}
