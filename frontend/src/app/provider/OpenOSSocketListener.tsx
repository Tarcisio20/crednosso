"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { useOpenOSJobsStore } from "../store/useOpenOSJobsStore"; 

export function OpenOSSocketListener() {
  const startJob = useOpenOSJobsStore((s) => s.startJob);
  const progressJob = useOpenOSJobsStore((s) => s.progressJob);
  const doneJob = useOpenOSJobsStore((s) => s.doneJob);
  const errorJob = useOpenOSJobsStore((s) => s.errorJob);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onStarted = (p: any) => {
      const jobId = String(p?.jobId ?? "");
      if (!jobId) return;
      startJob(jobId);
      toast.message("Geração de OS iniciada.");
    };

    const onProgress = (p: any) => {
      const jobId = String(p?.jobId ?? "");
      if (!jobId) return;
      progressJob(jobId, p?.message);
      // opcional: não spammar toast aqui
    };

    const onDone = (p: any) => {
      const jobId = String(p?.jobId ?? "");
      if (!jobId) return;
      doneJob(jobId);
      toast.success(p?.ok ? "OS finalizada com sucesso!" : "OS finalizada, mas com falhas.");
    };

    const onError = (p: any) => {
      const jobId = String(p?.jobId ?? "");
      if (!jobId) return;
      errorJob(jobId, p?.details ?? p?.error);
      toast.error(p?.details ?? p?.error ?? "Erro ao gerar OS");
    };

    socket.on("openos:started", onStarted);
    socket.on("openos:progress", onProgress);
    socket.on("openos:done", onDone);
    socket.on("openos:error", onError);

    return () => {
      socket.off("openos:started", onStarted);
      socket.off("openos:progress", onProgress);
      socket.off("openos:done", onDone);
      socket.off("openos:error", onError);
    };
  }, [startJob, progressJob, doneJob, errorJob]);

  return null;
}