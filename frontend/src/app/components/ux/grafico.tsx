'use client'

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

import { useEffect, useState } from 'react'
import { ChartContainer } from '@/components/ui/chart'
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaAnual } from '@/types/mediasType'

const nomeMeses = [
  '', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
]

export default function Grafico({ dados }: { dados: MediaAnual[] }) {
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null)
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([])

  useEffect(() => {
    if (!anoSelecionado && dados.length > 0) {
      setAnoSelecionado(dados[0].ano)
    }
  }, [dados])

  useEffect(() => {
    if (!anoSelecionado) return
    const ano = dados.find((d) => d.ano === anoSelecionado)
    if (!ano) return

    const formatado = ano.meses.map((m) => ({
      mes: nomeMeses[m.mes],
      solicitado: m.media_solicitada,
      confirmado: m.media_confirmada,
    }))

    setDadosGrafico(formatado)
  }, [anoSelecionado, dados])

  return (
    <Card className='max-h-2'>
      <CardHeader>
        <CardTitle className="text-center">Comparativo de Valores por Mês</CardTitle>
        <div className="mt-4">
          <Select
            onValueChange={(value) => setAnoSelecionado(Number(value))}
            value={anoSelecionado?.toString()}
          >
            <SelectTrigger className="w-full mx-auto">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {dados.map((d) => (
                <SelectItem key={d.ano} value={d.ano.toString()}>
                  {d.ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            desktop: { label: 'Solicitado', color: '#2563eb' },
            mobile: { label: 'Confirmado', color: '#60a5fa' },
          }}
          className="min-h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="solicitado" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="confirmado" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
