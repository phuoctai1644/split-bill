import { create } from 'zustand';

export type Group = { id: string; name: string; currency: 'VND'|'USD'|'EUR'; createdAt: string };

type State = {
  groups: Group[];
};
export const useGroupsStore = create<State>(() => ({
  groups: [{ id: 'demo', name: 'Đà Lạt Trip', currency: 'VND', createdAt: new Date().toISOString() }],
}));
