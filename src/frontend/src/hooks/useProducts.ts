import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, ProductId } from '../backend';

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: ProductId) {
  const { actor, isFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', productId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      price: bigint;
      description: string;
      category: string;
      stock: bigint;
      imageUrls: string[];
      points: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(
        data.name,
        data.price,
        data.description,
        data.category,
        data.stock,
        data.imageUrls,
        data.points
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: ProductId;
      name: string;
      price: bigint;
      description: string;
      category: string;
      stock: bigint;
      imageUrls: string[];
      isActive: boolean;
      points: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(
        data.productId,
        data.name,
        data.price,
        data.description,
        data.category,
        data.stock,
        data.imageUrls,
        data.isActive,
        data.points
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useToggleProductActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleProductActive(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
