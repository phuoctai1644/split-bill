import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesRepo } from '@/services/repos/expenses.repo';

export const useExpenses = (groupId?: string) =>
  useQuery({
    queryKey: ['expenses', groupId],
    queryFn: () => expensesRepo.listByGroup(groupId!),
    enabled: !!groupId,
  });

export const useCreateExpense = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof expensesRepo.create>[0]) => expensesRepo.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expenses', groupId] }),
  });
};
