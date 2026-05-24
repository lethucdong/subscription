"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"

const COLORS = [
  "#7c3aed",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
]

interface VendorData {
  name: string
  logo: string
  category: string
  totalSpending: number
}

interface VendorSpendChartProps {
  vendors: VendorData[]
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const item = payload[0]
    return (
      <div className="rounded-xl border border-white/[0.12] bg-gray-900/95 backdrop-blur-xl px-3 py-2.5 shadow-2xl shadow-black/50">
        <p className="text-xs text-gray-400">{item.name}</p>
        <p className="text-sm font-bold text-white mt-0.5">
          {formatCurrency(item.value)}
          <span className="text-xs font-normal text-gray-500 ml-1">/ yr</span>
        </p>
      </div>
    )
  }
  return null
}

export function VendorSpendChart({ vendors }: VendorSpendChartProps) {
  const data = vendors
    .sort((a, b) => b.totalSpending - a.totalSpending)
    .slice(0, 6)
    .map((v, i) => ({
      name: v.name,
      value: v.totalSpending,
      logo: v.logo,
      color: COLORS[i],
    }))

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gray-900/50 p-6">
      <div className="mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Spend by Vendor
        </h3>
        <p className="mt-1 text-2xl font-bold text-white">
          {formatCurrency(total)}
          <span className="text-sm font-normal text-gray-500 ml-1">/ yr</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx={75}
                cy={75}
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-sm font-bold text-white">
              ${(total / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.map((item) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0"
            return (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-400 truncate flex-1">{item.name}</span>
                <span className="text-xs font-medium text-gray-300 tabular-nums">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
