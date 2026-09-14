import type { ReactNode } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardDayPoint, TopDiagnostic } from '@/api/types/dashboard'
import { MaterialIcon } from '@/components/common/MaterialIcon'

const PRIMARY = '#00626a'
const PRIMARY_SOFT = '#0e7c86'
const SECONDARY = '#505f76'
const DIAGNOSTIC_COLORS = ['#00626a', '#0e7c86', '#505f76', '#7cd4df', '#b7c8e1']

function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(amount)} FCFA`
}

function ChartCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-headline-sm font-semibold text-on-surface">{title}</h3>
        <MaterialIcon name={icon} className="text-secondary" />
      </div>
      <div className="h-56 w-full">{children}</div>
    </div>
  )
}

interface ConsultationsWeekChartProps {
  data: DashboardDayPoint[]
}

export function ConsultationsWeekChart({ data }: ConsultationsWeekChartProps) {
  return (
    <ChartCard title="Consultations (7 jours)" icon="show_chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="consultationsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
              <stop offset="100%" stopColor={PRIMARY} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe3e3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: SECONDARY, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: SECONDARY, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => [value ?? 0, 'Consultations']}
            labelFormatter={(_, payload) => {
              const point = payload?.[0]?.payload as DashboardDayPoint | undefined
              return point?.date ?? ''
            }}
            contentStyle={{ borderRadius: 8, borderColor: '#c1c8c9', fontSize: 13 }}
          />
          <Area
            type="monotone"
            dataKey="consultations"
            stroke={PRIMARY}
            strokeWidth={2}
            fill="url(#consultationsFill)"
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface RevenueWeekChartProps {
  data: DashboardDayPoint[]
}

export function RevenueWeekChart({ data }: RevenueWeekChartProps) {
  return (
    <ChartCard title="Recettes (7 jours)" icon="payments">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe3e3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: SECONDARY, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: SECONDARY, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(Number(v))}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Recettes']}
            contentStyle={{ borderRadius: 8, borderColor: '#c1c8c9', fontSize: 13 }}
          />
          <Bar dataKey="recettes" fill={PRIMARY_SOFT} radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface DiagnosticsDonutChartProps {
  items: TopDiagnostic[]
}

export function DiagnosticsDonutChart({ items }: DiagnosticsDonutChartProps) {
  const hasData = items.some((item) => item.percent > 0)

  return (
    <ChartCard title="Répartition diagnostics" icon="donut_large">
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="percent"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
            >
              {items.map((item, index) => (
                <Cell key={item.label} fill={DIAGNOSTIC_COLORS[index % DIAGNOSTIC_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value ?? 0}%`, String(name)]}
              contentStyle={{ borderRadius: 8, borderColor: '#c1c8c9', fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-body-sm text-secondary">
          Aucune donnée diagnostic
        </div>
      )}
    </ChartCard>
  )
}
