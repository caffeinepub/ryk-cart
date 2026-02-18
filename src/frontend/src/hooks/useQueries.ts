import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, RedemptionType } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useGetCallerPrincipal() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<string>({
    queryKey: ['callerPrincipal'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getCallerPrincipal();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useCheckBootstrapAvailable() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<boolean>({
    queryKey: ['bootstrapAvailable'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isBootstrapAvailable();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return false;
        }
        return false;
      }
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    retry: false,
  });
}

export function useClaimAdminBootstrap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!actor) throw new Error('Actor not available');

      try {
        // Pass the password to the backend for validation
        await actor.requestBootstrap(password);
      } catch (error: any) {
        // Map backend errors to user-friendly messages
        const errorMsg = error.message || String(error);
        
        if (errorMsg.includes('Bootstrap already claimed')) {
          throw new Error('Admin access has already been claimed by another user');
        } else if (errorMsg.includes('Unauthorized') || errorMsg.includes('password')) {
          throw new Error('Incorrect password. Please try again.');
        } else if (errorMsg.includes('Bootstrap failed')) {
          throw new Error('Failed to grant admin permissions. Please try again.');
        } else {
          throw new Error('Failed to claim admin access. Please check your password and try again.');
        }
      }
    },
    onSuccess: async () => {
      // Invalidate and immediately refetch admin status and bootstrap availability
      await queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      await queryClient.invalidateQueries({ queryKey: ['bootstrapAvailable'] });
      await queryClient.refetchQueries({ queryKey: ['isAdmin'] });
      await queryClient.refetchQueries({ queryKey: ['bootstrapAvailable'] });
    },
  });
}

export function useGetPointsBalance() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<bigint>({
    queryKey: ['points'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getPointsBalance();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useRedeemPoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: RedemptionType) => {
      if (!actor) throw new Error('Actor not available');
      return actor.redeemPoints(reward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['points'] });
    },
  });
}
