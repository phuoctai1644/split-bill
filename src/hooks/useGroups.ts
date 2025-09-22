import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsRepo } from '@/services/repos/groups.repo';

export const useGroups = () =>
  useQuery({ queryKey: ['groups'], queryFn: groupsRepo.list });

export const useGroup = (id?: string) =>
  useQuery({
    queryKey: ['group', id],
    queryFn: () => groupsRepo.get(id!),
    enabled: !!id,
  });

export const useCreateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groupsRepo.create,
    onSuccess: (g) => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      qc.setQueryData(['group', g.id], g);
    },
  });
};

export const useUpdateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) => groupsRepo.update(id, patch),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      qc.invalidateQueries({ queryKey: ['group', id] });
    },
  });
};

export const useDeleteGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groupsRepo.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  });
};
