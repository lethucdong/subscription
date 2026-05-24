"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

interface MonthlyData {
  month: string
  amount: number
  previousAmount: number
}

interface SpendingChartProps {
  data: MonthlyData[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const current = payload[0]?.value
    const previous = payload[1]?.value
    const diff = current - previous
    const pct = previous ? ((diff / previous) * 100).toFixed(1) : "0"

    return (
      <div className="rounded-xl border border-white/[0.12] bg-gray-900/95 backdrop-blur-xl p-3 shadow-2xl shadow-black/50">
        <p className="text-xs text-gray-400 mb-2">{label}</p>
        <p className="text-lg font-bold text-white tabular-nums">
          {formatCurrency(current)}
        </p>
        <p className="text-xs mt-1 flex items-center gap-1">
          <span className={diff >= 0 ? "text-red-400" : "text-emerald-400"}>
            {diff >= 0 ? "↑" : "↓"} {Math.abs(Number(pct))}%
          </span>
          <span className="text-gray-600">vs prev month</span>
        </p>
      </div>
    )
  }
  return null
}

export function SpendingChart({ data }: SpendingChartProps) {
  const latest = data[data.length - 1]
  const prev = data[data.length - 2]
  const diff = latest && prev ? ((latest.amount - prev.amount) / prev.amount * 100).toFixed(2) : "0"
  const isUp = latest && prev ? latest.amount >= prev.amount : false

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Monthly Spend
          </h3>
          <p className="mt-1 text-2xl font-bold text-white">
            {latest ? formatCurrency(latest.amount) : "$0"}
          </p>
          <p className={`text-xs mt-0.5 ${isUp ? "text-red-400" : "text-emerald-400"}`}>
            {isUp ? "↑" : "↓"} {Math.abs(Number(diff))}% vs last month
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-violet-500" />
            Current
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-gray-700" />
            Previous
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientGray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#374151" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#374151" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#4b5563", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#4b5563", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="previousAmount"
            stroke="#374151"
            strokeWidth={1.5}
            fill="url(#gradientGray)"
            strokeDasharray="4 4"
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#gradientPurple)"
            dot={false}
            activeDot={{ r: 4, fill: "#7c3aed", stroke: "#1a1a24", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
