import { useAtomValue } from 'jotai';

import { Card, Skeleton } from '@/pages/Hospital/components/Card';
import StatusPill from '@/pages/Hospital/components/StatusPill';
import { useHospitalTranslation } from '@/pages/Hospital/i18n/useHospitalTranslation';
import { useCareStationSnapshot } from '@/pages/Hospital/queries/useCareStationSnapshot';
import { activeFacilityAtom } from '@/pages/Hospital/states/shellAtoms';

interface StatCardProps {
  label: string;
  value: string;
  progress?: number;
}

const StatCard = ({ label, value, progress }: StatCardProps): React.ReactNode => (
  <Card>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="title-2xl">{value}</p>
    {progress !== undefined && (
      <div className="mt-md h-sm overflow-hidden rounded-full bg-steel-100">
        <div className="h-full rounded-full bg-steel-500" style={{ width: `${progress}%` }} />
      </div>
    )}
  </Card>
);

const DashboardPage = (): React.ReactNode => {
  const { t } = useHospitalTranslation();
  const activeFacility = useAtomValue(activeFacilityAtom);
  const snapshot = useCareStationSnapshot();

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex flex-col gap-xs">
        <div className="flex flex-wrap items-center gap-md">
          <h1 className="title-2xl">{t('dashboard.title')}</h1>
          <span className="rounded-sm bg-steel-100 px-sm py-[2px] text-xs font-bold text-steel-700">
            {activeFacility}
          </span>
        </div>
        <p className="text-gray-600">{t('dashboard.subtitle')}</p>
      </div>

      {snapshot.isLoading ? (
        <div className="grid grid-cols-1 gap-lg md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-[104px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-lg md:grid-cols-4">
          <StatCard
            label={t('dashboard.stationHealth')}
            value={`${snapshot.data?.stationHealth ?? 0}%`}
            progress={snapshot.data?.stationHealth ?? 0}
          />
          <StatCard
            label={t('dashboard.apiLatency')}
            value={`${snapshot.data?.apiLatencyMs ?? 0}ms`}
          />
          <StatCard label={t('dashboard.openAlerts')} value={`${snapshot.data?.openAlerts ?? 0}`} />
          <StatCard label={t('dashboard.queueDepth')} value={`${snapshot.data?.queueDepth ?? 0}`} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-[2fr_1fr]">
        <Card>
          <h2 className="title-sm mb-lg">{t('integrations.title')}</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-2 text-left text-xs uppercase text-gray-600">
                <th className="py-sm">System</th>
                <th className="py-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {(snapshot.data?.integrationStatus || []).map((item) => (
                <tr key={item.name} className="border-b border-outline-2 last:border-b-0">
                  <td className="py-sm">{item.name}</td>
                  <td className="py-sm">
                    <StatusPill status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card className="border-steel-900 bg-steel-900 text-white">
          <div className="flex flex-col gap-md">
            <p className="text-sm text-white/70">{t('dashboard.lastSync')}</p>
            <p className="title-sm">{snapshot.data?.systemTime ?? '-'}</p>
            <div className="h-[1px] bg-white/30" />
            <p className="text-sm text-white/80">
              This shell is wired for platform concerns only: transport, telemetry, state, routing,
              and presentation.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
