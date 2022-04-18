import { Column } from 'react-table';

import type { DockerContainer } from '@/docker/containers/types';

export const host: Column<DockerContainer> = {
  Header: '主机',
  accessor: (row) => row.NodeName || '-',
  id: 'host',
  disableFilters: true,
  canHide: true,
  sortType: 'string',
  Filter: () => null,
};
