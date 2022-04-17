import moment from 'moment';
import _ from 'lodash-es';
import { NEW_LINE_BREAKER } from '@/constants';

angular.module('portainer.docker').controller('LogViewerController', [
  'clipboard',
  'Blob',
  'FileSaver',
  function (clipboard, Blob, FileSaver) {
    this.state = {
      availableSinceDatetime: [
        { desc: '昨天', value: moment().subtract(1, 'days').format() },
        { desc: '前4个小时', value: moment().subtract(4, 'hours').format() },
        { desc: '上1个小时', value: moment().subtract(1, 'hours').format() },
        { desc: '前10分钟', value: moment().subtract(10, 'minutes').format() },
      ],
      copySupported: clipboard.supported,
      logCollection: true,
      autoScroll: true,
      wrapLines: true,
      search: '',
      filteredLogs: [],
      selectedLines: [],
    };

    this.copy = function () {
      clipboard.copyText(this.state.filteredLogs.map((log) => log.line).join(NEW_LINE_BREAKER));
      $('#refreshRateChange').show();
      $('#refreshRateChange').fadeOut(2000);
    };

    this.copySelection = function () {
      clipboard.copyText(this.state.selectedLines.join(NEW_LINE_BREAKER));
      $('#refreshRateChange').show();
      $('#refreshRateChange').fadeOut(2000);
    };

    this.clearSelection = function () {
      this.state.selectedLines = [];
    };

    this.selectLine = function (line) {
      var idx = this.state.selectedLines.indexOf(line);
      if (idx === -1) {
        this.state.selectedLines.push(line);
      } else {
        this.state.selectedLines.splice(idx, 1);
      }
    };

    this.downloadLogs = function () {
      // To make the feature of downloading container logs working both on Windows and Linux,
      // we need to use correct new line breakers on corresponding OS.
      const data = new Blob([_.reduce(this.state.filteredLogs, (acc, log) => acc + log.line + NEW_LINE_BREAKER, '')]);
      FileSaver.saveAs(data, this.resourceName + '_logs.txt');
    };
  },
]);
