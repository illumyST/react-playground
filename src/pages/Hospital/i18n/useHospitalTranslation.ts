import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

import { type HospitalLanguage, hospitalResources, type HospitalTranslation } from './resources';

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;

export type HospitalTranslationKey = {
  [K in keyof HospitalTranslation]: Join<K, keyof HospitalTranslation[K]>;
}[keyof HospitalTranslation];

export const hospitalLanguageAtom = atom<HospitalLanguage>('zh-TW');

const isHospitalLanguage = (value: string): value is HospitalLanguage => value in hospitalResources;

// 取代原本的 i18next：Hospital 只有兩種語系且字典是靜態的，用 Jotai atom 管理語系即可。
export const useHospitalTranslation = () => {
  const [language, setLanguage] = useAtom(hospitalLanguageAtom);

  const t = useCallback(
    (key: HospitalTranslationKey) => {
      const [namespace, field] = key.split('.') as [keyof HospitalTranslation, string];
      const dictionary = hospitalResources[language][namespace] as Record<string, string>;
      return dictionary[field] ?? key;
    },
    [language],
  );

  const changeLanguage = useCallback(
    (next: string) => {
      if (isHospitalLanguage(next)) setLanguage(next);
    },
    [setLanguage],
  );

  return { t, language, changeLanguage };
};
