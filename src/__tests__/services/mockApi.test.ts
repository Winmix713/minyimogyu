import { describe, it, expect } from 'vitest';
import { jobsService } from '@/services/jobsService';
import { modelsService } from '@/services/modelsService';
import { predictionsService } from '@/services/predictionsService';
import { authService } from '@/services/authService';

describe('Mock API Services', () => {
  describe('jobsService', () => {
    it('should fetch jobs', async () => {
      const jobs = await jobsService.getJobs();
      
      expect(jobs).toBeDefined();
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
    });

    it('should fetch job by id', async () => {
      const jobs = await jobsService.getJobs();
      const firstJob = jobs[0];
      
      const job = await jobsService.getJobById(firstJob.id);
      
      expect(job).toBeDefined();
      expect(job.id).toBe(firstJob.id);
    });

    it('should create a job', async () => {
      const newJob = await jobsService.createJob({
        job_name: 'test-job',
        job_type: 'prediction',
        cron_schedule: '0 0 * * *',
      });
      
      expect(newJob).toBeDefined();
      expect(newJob.job_name).toBe('test-job');
      expect(newJob.id).toBeDefined();
    });
  });

  describe('modelsService', () => {
    it('should fetch models', async () => {
      const models = await modelsService.getModels();
      
      expect(models).toBeDefined();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should fetch model metrics', async () => {
      const models = await modelsService.getModels();
      const firstModel = models[0];
      
      const metrics = await modelsService.getModelMetrics(firstModel.id);
      
      expect(metrics).toBeDefined();
      expect(metrics.accuracy).toBeDefined();
      expect(metrics.totalPredictions).toBeDefined();
    });
  });

  describe('predictionsService', () => {
    it('should fetch predictions', async () => {
      const predictions = await predictionsService.getPredictions();
      
      expect(predictions).toBeDefined();
      expect(Array.isArray(predictions)).toBe(true);
      expect(predictions.length).toBeGreaterThan(0);
    });

    it('should filter predictions by model', async () => {
      const allPredictions = await predictionsService.getPredictions();
      const modelId = allPredictions[0].model_id;
      
      const filtered = await predictionsService.getPredictions({
        modelId,
      });
      
      expect(filtered.every(p => p.model_id === modelId)).toBe(true);
    });

    it('should get prediction stats', async () => {
      const stats = await predictionsService.getPredictionStats();
      
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.accuracy).toBeGreaterThanOrEqual(0);
    });
  });

  describe('authService', () => {
    it('should login successfully', async () => {
      const result = await authService.login({
        email: 'admin@winmix.com',
        password: 'password123',
      });
      
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('admin@winmix.com');
    });

    it('should logout successfully', async () => {
      await expect(authService.logout()).resolves.not.toThrow();
    });
  });
});
