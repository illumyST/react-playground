import { atom } from 'jotai';

import type {
  AuthSessionResponse,
  NavigationMenuItem,
  UserProfile,
} from '@/pages/Hospital/api/HospitalPlatform/model';

export const activeFacilityAtom = atom('North Campus');

// playground 未開 strictNullChecks，用斷言讓 Jotai 推成 PrimitiveAtom 而非唯讀 atom
export const currentMenuIdAtom = atom(null as string | null);

export const allowedMenuIdsAtom = atom<string[]>([]);

export const navigationMenusAtom = atom<NavigationMenuItem[]>([]);

export const currentScenarioAtom = atom('default');

export const shellUserAtom = atom(null as UserProfile | null);

export const shellAuthenticatedAtom = atom(false);

export const applyAuthSessionAtom = atom(
  null,
  (_, set, session: AuthSessionResponse & { systemTime: string }) => {
    const matchedFacility = session.facilities.find(
      (facility) => facility.id === session.defaultFacility,
    );

    set(shellAuthenticatedAtom, session.isAuthenticated);
    set(shellUserAtom, session.user);
    set(currentScenarioAtom, session.defaultScenario);
    set(activeFacilityAtom, matchedFacility?.name || session.defaultFacility);
  },
);

export const applyNavigationMenuAtom = atom(
  null,
  (_, set, payload: { menus: NavigationMenuItem[]; allowedMenuIds: string[] }) => {
    set(navigationMenusAtom, payload.menus);
    set(allowedMenuIdsAtom, payload.allowedMenuIds);
  },
);
