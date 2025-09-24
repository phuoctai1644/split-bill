import { useMemo } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { useMembers } from '@/hooks/useMembers';
import { computeBalances } from '@/utils/balance';

export function useGroupBalances(groupId?: string) {
  const { data: expenses = [], isLoading: loadingE } = useExpenses(groupId);
  const { data: members = [], isLoading: loadingM } = useMembers(groupId!);

  const balances = useMemo(() => {
    const ids = members.map((m) => m.id);
    return computeBalances(expenses, ids);
  }, [expenses, members]);

  return { balances, members, loading: loadingE || loadingM };
}
