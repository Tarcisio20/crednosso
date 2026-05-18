"use client";

import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAtmMonitoring } from "@/app/service/atm-monitoring";
import { Card, CardContent } from "@/components/ui/card";
import { AtmMonitoringType } from "@/types/atmMonitoringType";
import { faDisplay } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AtmMonitoring() {
  const [dateMonitor, setDateMonitor] = useState("");
  const [monitoring, setMonitoring] = useState<AtmMonitoringType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Monitoramento de ATMs";

    const dataAtual = getDataAtualInput();
    setDateMonitor(dataAtual);

    loadMonitoring(dataAtual);
  }, []);

  function getDataAtualInput() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  function parseCurrencyBR(value: string | number | null | undefined) {
    if (value === null || value === undefined) return 0;

    if (typeof value === "number") return value;

    const parsed = Number(
      value
        .replace("R$", "")
        .replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
    );

    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function parseQuantity(value: string | number | null | undefined) {
    if (value === null || value === undefined) return 0;

    if (typeof value === "number") return value;

    const parsed = Number(value.replace(/\./g, "").replace(",", "."));

    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function parseAtmId(value: string | number | null | undefined) {
    if (value === null || value === undefined) return 0;

    const parsed = Number(String(value).replace(/\D/g, ""));

    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function formatCurrencyBR(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function loadMonitoring(date: string) {
    try {
      setLoading(true);

      const response = await getAtmMonitoring(date);

      const atmMonitoring = response?.data?.atmMonitoring;

      if (
        response?.status === 200 &&
        Array.isArray(atmMonitoring) &&
        atmMonitoring.length > 0
      ) {
        const orderedMonitoring = [...atmMonitoring].sort((a, b) => {
          return parseAtmId(a.id_atm) - parseAtmId(b.id_atm);
        });

        setMonitoring(orderedMonitoring);
        return;
      }

      setMonitoring([]);
    } catch (error) {
      console.log("ERRO AO BUSCAR MONITORAMENTO =>", error);
      setMonitoring([]);
      toast.error("Erro ao buscar monitoramento dos ATMs.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMonitorDay() {
    if (!dateMonitor) {
      toast.error("Selecione uma data para buscar o monitoramento!");
      return;
    }

    await loadMonitoring(dateMonitor);
  }

  return (
    <Page>
      <TitlePages linkBack="/order/search" icon={faDisplay}>
        ATMs Monitor
      </TitlePages>

      <div className="flex flex-col gap-4 w-full p-3">
        <div className="flex flex-col gap-3 w-full md:w-[320px]">
          <label className="text-lg uppercase font-semibold">Data</label>

          <input
            type="date"
            value={dateMonitor}
            onChange={(e) => setDateMonitor(e.target.value)}
            className="w-full h-10 outline-none rounded-md text-black text-center uppercase"
          />

          <button
            onClick={handleMonitorDay}
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 disabled:bg-green-900 disabled:cursor-not-allowed transition-colors rounded-md h-10 px-4 text-white font-medium"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 w-full">
          {monitoring.length > 0 ? (
            monitoring.map((item: AtmMonitoringType) => {
              const cassetes = [
                {
                  label: "A",
                  ativo: item.cassete_a_ativo,
                  cedula: item.cassete_a_cedula,
                  qtd: item.cassete_a,
                  rejeicao: item.cassete_a_rejeicao,
                },
                {
                  label: "B",
                  ativo: item.cassete_b_ativo,
                  cedula: item.cassete_b_cedula,
                  qtd: item.cassete_b,
                  rejeicao: item.cassete_b_rejeicao,
                },
                {
                  label: "C",
                  ativo: item.cassete_c_ativo,
                  cedula: item.cassete_c_cedula,
                  qtd: item.cassete_c,
                  rejeicao: item.cassete_c_rejeicao,
                },
                {
                  label: "D",
                  ativo: item.cassete_d_ativo,
                  cedula: item.cassete_d_cedula,
                  qtd: item.cassete_d,
                  rejeicao: item.cassete_d_rejeicao,
                },
              ];

              const totalCassetes = cassetes.reduce((total, cassete) => {
                const valorCedula = parseCurrencyBR(cassete.cedula);
                const qtd = parseQuantity(cassete.qtd);

                return total + valorCedula * qtd;
              }, 0);

              const totalRejeicao = cassetes.reduce((total, cassete) => {
                const valorCedula = parseCurrencyBR(cassete.cedula);
                const rejeicao = parseQuantity(cassete.rejeicao);

                return total + valorCedula * rejeicao;
              }, 0);

              const saldoTotal = totalCassetes + totalRejeicao;

              return (
                <Card
                  key={item.id}
                  className={`relative overflow-hidden border-2 bg-background rounded-md ${
                    item.ativo_atm ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <CardContent className="p-2">
                    <span
                      title={item.name_atm}
                      className="absolute top-2 left-[88px] right-[65px] z-20 truncate text-sm font-bold text-foreground"
                    >
                      {item.name_atm}
                    </span>

                    <span
                      className={`absolute top-0 right-0 z-30
                        h-14 min-w-[76px] px-4
                        translate-x-4 -translate-y-4
                        rounded-full flex items-center justify-center
                        text-lg font-black shadow-md
                        ${
                          item.ativo_atm
                            ? "bg-green-600 text-white border border-green-300"
                            : "bg-red-600 text-white border border-red-300"
                        }`}
                    >
                      {item.id_atm}
                    </span>

                    <div className="flex items-start gap-2 pt-5">
                      <div className="w-[72px] min-h-[180px] flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/assets/atm-vertical.png"
                          alt="ATM"
                          width={72}
                          height={150}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="w-full min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold ${
                              item.ativo_atm
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {item.ativo_atm ? "Online" : "Offline"}
                          </span>
                        </div>

                        <div className="w-full overflow-hidden text-[9px] leading-tight">
                          <div className="grid grid-cols-[28px_42px_35px_58px_30px_58px] gap-1 px-1 py-1 text-[8px] font-bold border-b border-zinc-700">
                            <div>CAS</div>
                            <div>Céd.</div>
                            <div>Qtd</div>
                            <div>Total</div>
                            <div>Rej</div>
                            <div>Total Rej.</div>
                          </div>

                          <div className="flex flex-col gap-1 mt-1">
                            {cassetes.map((cassete) => {
                              const valorCedula = parseCurrencyBR(
                                cassete.cedula
                              );
                              const qtd = parseQuantity(cassete.qtd);
                              const rejeicao = parseQuantity(
                                cassete.rejeicao
                              );

                              return (
                                <div
                                  key={cassete.label}
                                  className={`grid grid-cols-[28px_42px_35px_58px_30px_58px] gap-1 px-1 py-1 rounded-sm border ${
                                    cassete.ativo
                                      ? "border-green-500/60 bg-green-500/10"
                                      : "border-red-500/60 bg-red-500/10"
                                  }`}
                                >
                                  <div className="font-black">
                                    {cassete.label}
                                  </div>

                                  <div>{cassete.cedula}</div>

                                  <div>{cassete.qtd}</div>

                                  <div>
                                    {formatCurrencyBR(valorCedula * qtd)}
                                  </div>

                                  <div>{cassete.rejeicao}</div>

                                  <div>
                                    {formatCurrencyBR(valorCedula * rejeicao)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-2 grid grid-cols-3 gap-1 text-[8px]">
                            <div className="rounded-sm border border-green-700/60 bg-green-500/10 p-1">
                              <div className="font-bold">Cassetes</div>
                              <div className="font-black text-green-500">
                                {formatCurrencyBR(totalCassetes)}
                              </div>
                            </div>

                            <div className="rounded-sm border border-yellow-700/60 bg-yellow-500/10 p-1">
                              <div className="font-bold">Rejeição</div>
                              <div className="font-black text-yellow-500">
                                {formatCurrencyBR(totalRejeicao)}
                              </div>
                            </div>

                            <div className="rounded-sm border border-blue-700/60 bg-blue-500/10 p-1">
                              <div className="font-bold">Total</div>
                              <div className="font-black text-blue-500">
                                {formatCurrencyBR(saldoTotal)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-sm text-muted-foreground">
              {loading ? "Carregando..." : "Nada a mostrar"}
            </div>
          )}
        </div>
      </div>

      {loading && <Loading />}
    </Page>
  );
}