function createEventDetails(event) {
  var eventAttr = event.Actor.Attributes;
  var details = '';

  var action = event.Action;
  var extra = '';
  var hasColon = action.indexOf(':');
  if (hasColon != -1) {
    extra = action.substring(hasColon);
    action = action.substring(0, hasColon);
  }

  switch (event.Type) {
    case 'container':
      switch (action) {
        case 'stop':
          details = '容器' + eventAttr.name + '已停止';
          break;
        case 'destroy':
          details = '容器' + eventAttr.name + '删除';
          break;
        case 'create':
          details = '容器' + eventAttr.name + '创建';
          break;
        case 'start':
          details = '容器' + eventAttr.name + '启动';
          break;
        case 'kill':
          details = '容器' + eventAttr.name + '终止';
          break;
        case 'die':
          details = '容器' + eventAttr.name + '退出，状态码：' + eventAttr.exitCode;
          break;
        case 'commit':
          details = '容器' + eventAttr.name + '提交';
          break;
        case 'restart':
          details = '容器' + eventAttr.name + '重启';
          break;
        case 'pause':
          details = '容器' + eventAttr.name + '暂停';
          break;
        case 'unpause':
          details = '容器' + eventAttr.name + '未暂停';
          break;
        case 'attach':
          details = '容器' + eventAttr.name + '已接入';
          break;
        case 'detach':
          details = '容器' + eventAttr.name + '已分离';
          break;
        case 'copy':
          details = '容器' + eventAttr.name + '已复制';
          break;
        case 'export':
          details = '容器' + eventAttr.name + '已导出';
          break;
        case 'health_status':
          details = '容器' + eventAttr.name + '执行健康检查';
          break;
        case 'oom':
          details = '容器' + eventAttr.name + '超出内存限制';
          break;
        case 'rename':
          details = '容器' + eventAttr.name + '已重命名';
          break;
        case 'resize':
          details = '容器' + eventAttr.name + '已调整大小';
          break;
        case 'top':
          details = '显示容器运行进程' + eventAttr.name;
          break;
        case 'update':
          details = '容器' + eventAttr.name + '已更新';
          break;
        case 'exec_create':
          details = 'Exec instance created';
          break;
        case 'exec_start':
          details = '执行实例启动';
          break;
        case 'exec_die':
          details = '执行实例退出';
          break;
        default:
          details = '不支持事件';
      }
      break;
    case 'image':
      switch (action) {
        case 'delete':
          details = '镜像已删除';
          break;
        case 'import':
          details = '镜像' + event.Actor.ID + '已导入';
          break;
        case 'load':
          details = '镜像' + event.Actor.ID + '已加载';
          break;
        case 'tag':
          details = '为事件创建新标签' + eventAttr.name;
          break;
        case 'untag':
          details = '未打标签的镜像';
          break;
        case 'save':
          details = '镜像' + event.Actor.ID + '已保存';
          break;
        case 'pull':
          details = '镜像' + event.Actor.ID + '已下载';
          break;
        case 'push':
          details = '镜像' + event.Actor.ID + '已暂停';
          break;
        default:
          details = '不支持事件';
      }
      break;
    case 'network':
      switch (action) {
        case 'create':
          details = '网络' + eventAttr.name + '已创建';
          break;
        case 'destroy':
          details = '网络' + eventAttr.name + '已删除';
          break;
        case 'remove':
          details = '网络' + eventAttr.name + '已移出';
          break;
        case 'connect':
          details = '容器已连接到' + eventAttr.name + '网络';
          break;
        case 'disconnect':
          details = '容器已从' + eventAttr.name + '网络中断开连接';
          break;
        default:
          details = '不支持事件';
      }
      break;
    case 'volume':
      switch (action) {
        case 'create':
          details = '存储卷' + event.Actor.ID + '已创建';
          break;
        case 'destroy':
          details = '存储卷' + event.Actor.ID + '已删除';
          break;
        case 'mount':
          details = '存储卷' + event.Actor.ID + '已挂载';
          break;
        case 'unmount':
          details = '存储卷' + event.Actor.ID + '已卸载';
          break;
        default:
          details = '不支持事件';
      }
      break;
    default:
      details = '不支持事件';
  }
  return details + extra;
}

export function EventViewModel(data) {
  // Type, Action, Actor unavailable in Docker < 1.10
  this.Time = data.time;
  if (data.Type) {
    this.Type = data.Type;
    this.Details = createEventDetails(data);
  } else {
    this.Type = data.status;
    this.Details = data.from;
  }
}
