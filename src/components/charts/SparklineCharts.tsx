import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const chartColors = {
  blue: '#0C65F4',
  purple: '#593090',
  magenta: '#C52B85',
  cyan: '#2292D9',
  orange: '#E37C33',
  slate: '#152238',
  emerald: '#10B981',
};

// Custom SaaS Dark Tooltip
export const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sparkline-midnight border border-sparkline-slate text-white p-3 rounded-xl shadow-premium text-xs z-50">
        {label && <p className="font-bold text-slate-300 mb-1.5">{label}</p>}
        <div className="space-y-1">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color || item.fill }}
                />
                <span>{item.name}:</span>
              </span>
              <span className="font-bold font-mono text-white">
                {typeof item.value === 'number'
                  ? item.value.toLocaleString()
                  : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// 1. SparklineAreaChart
export interface AreaSeries {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
}

export interface SparklineAreaChartProps {
  data: any[];
  xKey: string;
  series: AreaSeries[];
  height?: number | string;
  yTickFormatter?: (val: number) => string;
}

export const SparklineAreaChart: React.FC<SparklineAreaChartProps> = ({
  data,
  xKey,
  series,
  height = '100%',
  yTickFormatter,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.dataKey} id={`grad-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0.0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey={xKey} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94A3B8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={yTickFormatter}
        />
        <Tooltip content={<ChartTooltip />} />
        {series.map((s) => (
          <Area
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color}
            strokeWidth={s.strokeWidth || 2.5}
            fill={`url(#grad-${s.dataKey})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// 2. SparklineLineChart
export interface LineSeries {
  dataKey: string;
  name: string;
  color: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

export interface SparklineLineChartProps {
  data: any[];
  xKey: string;
  series: LineSeries[];
  height?: number | string;
  yTickFormatter?: (val: number) => string;
}

export const SparklineLineChart: React.FC<SparklineLineChartProps> = ({
  data,
  xKey,
  series,
  height = '100%',
  yTickFormatter,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey={xKey} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94A3B8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={yTickFormatter}
        />
        <Tooltip content={<ChartTooltip />} />
        {series.map((s) => (
          <Line
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color}
            strokeWidth={s.strokeWidth || 2.5}
            strokeDasharray={s.strokeDasharray}
            dot={false}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// 3. SparklineBarChart
export interface BarSeries {
  dataKey: string;
  name: string;
  color: string;
}

export interface SparklineBarChartProps {
  data: any[];
  xKey: string;
  series: BarSeries[];
  height?: number | string;
  yTickFormatter?: (val: number) => string;
}

export const SparklineBarChart: React.FC<SparklineBarChartProps> = ({
  data,
  xKey,
  series,
  height = '100%',
  yTickFormatter,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey={xKey} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#94A3B8"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={yTickFormatter}
        />
        <Tooltip content={<ChartTooltip />} />
        {series.map((s) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            fill={s.color}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// 4. SparklineDonutChart
export interface PieDatum {
  name: string;
  value: number;
  color: string;
}

export interface SparklineDonutChartProps {
  data: PieDatum[];
  centerLabel?: string;
  centerValue?: string;
  height?: number | string;
}

export const SparklineDonutChart: React.FC<SparklineDonutChartProps> = ({
  data,
  centerLabel,
  centerValue,
  height = '100%',
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            innerRadius="65%"
            outerRadius="90%"
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          {centerValue && (
            <div className="text-lg font-bold font-display text-sparkline-midnight">
              {centerValue}
            </div>
          )}
          {centerLabel && (
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              {centerLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

