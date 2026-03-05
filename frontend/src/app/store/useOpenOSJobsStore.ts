// src/stores/useOpenOSJobsStore.ts
import { create } from "zustand";

type JobStatus = "running" | "done" | "error";

type JobItem = {
  jobId: string;
  status: JobStatus;
  message?: string;
};

type State = {
  jobs: Record<string, JobItem>;
  startJob: (jobId: string) => void;
  progressJob: (jobId: string, message?: string) => void;
  doneJob: (jobId: string) => void;
  errorJob: (jobId: string, message?: string) => void;
  removeJob: (jobId: string) => void;
};

export const useOpenOSJobsStore = create<State>((set) => ({
  jobs: {},
  startJob: (jobId) =>
    set((s) => ({
      jobs: { ...s.jobs, [jobId]: { jobId, status: "running" } },
    })),
  progressJob: (jobId, message) =>
    set((s) => ({
      jobs: { ...s.jobs, [jobId]: { ...(s.jobs[jobId] ?? { jobId, status: "running" }), message } },
    })),
  doneJob: (jobId) =>
    set((s) => ({
      jobs: { ...s.jobs, [jobId]: { ...(s.jobs[jobId] ?? { jobId, status: "running" }), status: "done" } },
    })),
  errorJob: (jobId, message) =>
    set((s) => ({
      jobs: { ...s.jobs, [jobId]: { ...(s.jobs[jobId] ?? { jobId, status: "running" }), status: "error", message } },
    })),
  removeJob: (jobId) =>
    set((s) => {
      const copy = { ...s.jobs };
      delete copy[jobId];
      return { jobs: copy };
    }),
}));