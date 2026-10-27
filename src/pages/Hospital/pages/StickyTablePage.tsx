import { Loading } from '@/components';
import type { StationRow } from '@/pages/Hospital/api/HospitalPlatform/model';
import { Card } from '@/pages/Hospital/components/Card';
import StatusPill from '@/pages/Hospital/components/StatusPill';
import StickyCellTitle from '@/pages/Hospital/components/stickyTable/StickyCellTitle';
import StickyTable, {
  type StickySubContentContext,
  type StickyTableColumn,
} from '@/pages/Hospital/components/stickyTable/StickyTable';
import { useHospitalTranslation } from '@/pages/Hospital/i18n/useHospitalTranslation';
import { useStationList } from '@/pages/Hospital/queries/useStationList';

interface DeviceRow {
  id: string;
  name: string;
  type: string;
  status: 'ready' | 'watch' | 'offline';
  lastActive: string;
}

const childColumns: StickyTableColumn<DeviceRow>[] = [
  {
    key: 'name',
    header: '設備名稱',
    width: '200px',
    isSticky: true,
    render: (row) => <span className="font-bold">{row.name}</span>,
  },
  {
    key: 'type',
    header: '類型',
    width: '150px',
    render: (row) => row.type,
  },
  {
    key: 'status',
    header: '狀態',
    width: '120px',
    render: (row) => <StatusPill status={row.status} />,
  },
  {
    key: 'lastActive',
    header: '最後活動時間',
    width: '200px',
    render: (row) => row.lastActive,
  },
];

// 子表格 Header 的 sticky top 由外層實際量測的 Header + 父列高度提供
const renderDevices = (row: StationRow, { stickyTopOffset }: StickySubContentContext) => {
  const devices: DeviceRow[] = [
    {
      id: `${row.id}-d1`,
      name: `${row.station} - 主設備 01`,
      type: 'Gateway',
      status: row.status,
      lastActive: '2026-07-08 10:00',
    },
    {
      id: `${row.id}-d2`,
      name: `${row.station} - 備用設備 02`,
      type: 'Sensor',
      status: 'ready',
      lastActive: '2026-07-08 09:45',
    },
    {
      id: `${row.id}-d3`,
      name: `${row.station} - 監控探針 03`,
      type: 'Probe',
      status: 'watch',
      lastActive: '2026-07-08 09:30',
    },
  ];

  return (
    <div className="border-l-4 border-steel-400 bg-gray-100 p-md">
      <p className="mb-md font-bold text-steel-700">隸屬設備列表 (子表格 - Chained Sticky 測試)</p>
      <StickyTable
        rows={devices}
        columns={childColumns}
        isSubTable
        stickyTopOffset={stickyTopOffset}
      />
    </div>
  );
};

const StickyTablePage = (): React.ReactNode => {
  const { t } = useHospitalTranslation();
  const stations = useStationList();

  const columns: StickyTableColumn<StationRow>[] = [
    {
      key: 'station',
      header: t('stickyTable.station'),
      width: '220px',
      isSticky: true,
      render: (row) => <StickyCellTitle title={row.station} detail={row.floor} />,
    },
    {
      key: 'owner',
      header: t('stickyTable.owner'),
      width: '160px',
      render: (row) => row.owner,
    },
    {
      key: 'status',
      header: t('stickyTable.status'),
      width: '140px',
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'capacity',
      header: t('stickyTable.capacity'),
      width: '140px',
      render: (row) => row.capacity,
    },
    {
      key: 'latency',
      header: t('stickyTable.latency'),
      width: '140px',
      render: (row) => row.latency,
    },
    {
      key: 'sync',
      header: t('stickyTable.sync'),
      width: '210px',
      render: (row) => row.sync,
    },
    {
      key: 'notes',
      header: t('stickyTable.notes'),
      width: '260px',
      render: (row) => row.notes,
    },
  ];

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex flex-col gap-xs">
        <h1 className="title-2xl">{t('stickyTable.title')}</h1>
        <p className="text-gray-600">{t('stickyTable.subtitle')}</p>
      </div>
      <Card>
        {stations.isLoading ? (
          <Loading size="small" className="justify-start" />
        ) : (
          <StickyTable
            rows={stations.data?.items || []}
            columns={columns}
            renderSubContent={renderDevices}
          />
        )}
      </Card>
    </div>
  );
};

export default StickyTablePage;
