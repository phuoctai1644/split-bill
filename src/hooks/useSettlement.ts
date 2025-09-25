import { useMemo } from 'react';
import { useGroup } from '@/hooks/useGroups';
import { useGroupBalances } from '@/hooks/useBalances';
import { settle, validateSettlement, type Txn } from '@/utils/settlement';

export function useSettlement(groupId?: string) {
  const { data: group } = useGroup(groupId);
  const { balances, members, loading } = useGroupBalances(groupId);

  const result = useMemo(() => {
    const txns: Txn[] = settle(balances);
    const ok = validateSettlement(balances, txns);
    return { txns, ok };
  }, [balances]);

  return { currency: group!.currency, members, balances, loading, ...result };
}
