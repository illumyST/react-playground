import { Loading } from '@/components';
import { Card } from '@/pages/Hospital/components/Card';
import StatusPill from '@/pages/Hospital/components/StatusPill';
import { useHospitalTranslation } from '@/pages/Hospital/i18n/useHospitalTranslation';
import { useIntegrationList } from '@/pages/Hospital/queries/useIntegrationList';

const IntegrationsPage = (): React.ReactNode => {
  const { t } = useHospitalTranslation();
  const integrations = useIntegrationList();

  return (
    <div className="flex flex-col gap-2xl">
      <h1 className="title-2xl">{t('integrations.title')}</h1>
      {integrations.isLoading ? (
        <Loading size="small" className="justify-start" />
      ) : (
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
          {(integrations.data?.items || []).map((item) => (
            <Card key={item.name}>
              <div className="flex flex-col items-start gap-md">
                <StatusPill status={item.status} />
                <h2 className="title-sm">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;
