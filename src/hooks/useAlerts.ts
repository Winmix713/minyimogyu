import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertsService } from "@/services/alertsService";

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertsService.getAlerts(),
    refetchInterval: 10000,
  });
}

export function useAlertById(id: string) {
  return useQuery({
    queryKey: ["alert", id],
    queryFn: () => alertsService.getAlertById(id),
    enabled: !!id,
  });
}

export function useUnresolvedAlerts() {
  return useQuery({
    queryKey: ["alerts-unresolved"],
    queryFn: () => alertsService.getUnresolvedAlerts(),
    refetchInterval: 5000,
  });
}

export function useAlertsBySeverity(severity: string) {
  return useQuery({
    queryKey: ["alerts", severity],
    queryFn: () => alertsService.getAlertsBySeverity(severity as any),
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertsService.resolveAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alerts-unresolved"] });
    },
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertsService.deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alerts-unresolved"] });
    },
  });
}

export function useAlertStats() {
  return useQuery({
    queryKey: ["alert-stats"],
    queryFn: () => alertsService.getAlertStats(),
    refetchInterval: 15000,
  });
}
