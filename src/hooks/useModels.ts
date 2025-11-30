import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modelsService, type ModelFormData } from "@/services/modelsService";

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => modelsService.getModels(),
    refetchInterval: 15000,
  });
}

export function useModelById(id: string) {
  return useQuery({
    queryKey: ["model", id],
    queryFn: () => modelsService.getModelById(id),
    enabled: !!id,
  });
}

export function useActiveModels() {
  return useQuery({
    queryKey: ["models-active"],
    queryFn: () => modelsService.getActiveModels(),
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModelFormData) => modelsService.createModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
}

export function useUpdateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ModelFormData> }) =>
      modelsService.updateModel(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      queryClient.invalidateQueries({ queryKey: ["model", id] });
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => modelsService.deleteModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
}

export function useTrainModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => modelsService.trainModel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      queryClient.invalidateQueries({ queryKey: ["model", id] });
    },
  });
}

export function useModelMetrics(modelId: string) {
  return useQuery({
    queryKey: ["model-metrics", modelId],
    queryFn: () => modelsService.getModelMetrics(modelId),
    enabled: !!modelId,
  });
}
