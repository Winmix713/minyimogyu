import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService, type JobFormData } from "@/services/jobsService";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsService.getJobs(),
    refetchInterval: 10000,
  });
}

export function useJobById(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsService.getJobById(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobFormData) => jobsService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobFormData> }) =>
      jobsService.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useToggleJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsService.toggleJob(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    },
  });
}

export function useJobLogs(jobId: string) {
  return useQuery({
    queryKey: ["job-logs", jobId],
    queryFn: () => jobsService.getJobLogs(jobId),
    enabled: !!jobId,
  });
}
