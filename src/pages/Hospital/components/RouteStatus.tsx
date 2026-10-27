import { Link, useRouteError } from 'react-router-dom';

import { useHospitalTranslation } from '@/pages/Hospital/i18n/useHospitalTranslation';

import { Alert } from './Card';

export const HospitalFallback = (): React.ReactNode => {
  const error = useRouteError();
  const { t } = useHospitalTranslation();

  console.error('[hospital]', error);

  return (
    <div className="mx-auto flex max-w-[520px] flex-col gap-lg py-7xl text-left">
      <Alert status="error">{t('common.fallbackMessage')}</Alert>
      <Link to="/hospital/dashboard" className="text-steel-600 underline">
        {t('common.backToDashboard')}
      </Link>
    </div>
  );
};

export const HospitalNotFound = (): React.ReactNode => {
  const { t } = useHospitalTranslation();

  return (
    <div className="flex flex-col items-center gap-md py-7xl">
      <h1 className="title-lg">{t('common.notFound')}</h1>
      <Link to="/hospital/dashboard" className="text-steel-600 underline">
        {t('common.backToDashboard')}
      </Link>
    </div>
  );
};
