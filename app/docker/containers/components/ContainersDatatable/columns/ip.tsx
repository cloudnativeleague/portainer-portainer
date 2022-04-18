import { Column } from 'react-table';

import type { DockerContainer } from '@/docker/containers/types';

export const ip: Column<DockerContainer> = {
  Header: 'IP地址',
  accessor: (row) => row.IP || '-',
  id: 'ip',
  disableFilters: true,
  canHide: true,
  Filter: () => null,
};
