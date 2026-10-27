import { useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { Button } from '@/components';
import { Card } from '@/pages/Hospital/components/Card';
import { useHospitalTranslation } from '@/pages/Hospital/i18n/useHospitalTranslation';
import { useAuthSession } from '@/pages/Hospital/queries/useAuthSession';
import { useMockScenarios } from '@/pages/Hospital/queries/useMockScenarios';
import { activeFacilityAtom, currentScenarioAtom } from '@/pages/Hospital/states/shellAtoms';
import {
  isScenarioPinnedByQuery,
  setStoredMockScenario,
} from '@/pages/Hospital/utils/mockScenario';

const selectClassName =
  'w-full rounded-md border border-outline-3 bg-surface-1 px-md py-sm text-base disabled:cursor-not-allowed disabled:opacity-50';

const LANGUAGE_OPTIONS = [
  { value: 'zh-TW', label: '中文' },
  { value: 'en-US', label: 'EN' },
] as const;

const SettingsPage = (): React.ReactNode => {
  const { t, language, changeLanguage } = useHospitalTranslation();
  const queryClient = useQueryClient();
  const authSession = useAuthSession();
  const scenarioList = useMockScenarios();
  const [activeFacility, setActiveFacility] = useAtom(activeFacilityAtom);
  const scenario = useAtomValue(currentScenarioAtom);
  const isScenarioPinned = isScenarioPinnedByQuery();

  useEffect(() => {
    if (!authSession.data) return;

    const matchedFacility = authSession.data.facilities.find(
      (facility) => facility.id === authSession.data.defaultFacility,
    );
    setActiveFacility(matchedFacility?.name || authSession.data.defaultFacility);
  }, [authSession.data, setActiveFacility]);

  return (
    <div className="flex max-w-[720px] flex-col gap-2xl">
      <div className="flex flex-col gap-xs">
        <h1 className="title-2xl">{t('settings.title')}</h1>
        <p className="text-gray-600">{t('settings.description')}</p>
      </div>
      <Card>
        <div className="flex flex-col gap-xl">
          <label className="flex flex-col gap-sm">
            <span className="font-bold">{t('settings.facility')}</span>
            <select
              className={selectClassName}
              value={activeFacility}
              onChange={(event) => setActiveFacility(event.target.value)}
            >
              {(authSession.data?.facilities || []).map((facility) => (
                <option key={facility.id} value={facility.name}>
                  {facility.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-sm">
            <span className="font-bold">Mock Scenario</span>
            <select
              className={selectClassName}
              value={scenario}
              disabled={isScenarioPinned}
              onChange={async (event) => {
                setStoredMockScenario(event.target.value);
                await queryClient.invalidateQueries();
              }}
            >
              {(scenarioList.data?.items || []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              {isScenarioPinned
                ? 'Scenario is pinned by the current query string.'
                : (scenarioList.data?.items || []).find((item) => item.id === scenario)
                    ?.description || ''}
            </span>
          </label>
          <div className="flex flex-col gap-sm">
            <span className="font-bold">{t('settings.language')}</span>
            <div className="flex gap-sm">
              {LANGUAGE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  size="small"
                  variant={language === option.value ? 'filled' : 'outlined'}
                  onClick={() => changeLanguage(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
