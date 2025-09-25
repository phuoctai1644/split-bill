import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersRepo } from '@/services/repos/members.repo';
import type { Member } from '@/services/db';

export const useMembers = (groupId?: string) =>
  useQuery({
    queryKey: ['members', groupId],
    queryFn: () => membersRepo.listByGroup(groupId!),
    enabled: !!groupId,
  });

export const useCreateMember = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, alias }: { name: string; alias?: string }) =>
      membersRepo.create({ groupId, name, alias }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members', groupId] }),
  });
};

export const useUpdateMember = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<Member, 'name' | 'alias'>> }) => membersRepo.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members', groupId] }),
  });
};

export const useDeleteMember = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: membersRepo.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members', groupId] }),
  });
};
