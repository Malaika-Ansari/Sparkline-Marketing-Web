import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface SparklineChartProps {
  data?: { date: string; spend: number; revenue: number; roas: number }[];
  height?: number;
}

const defaultPerformanceData = [
  { date: 'Oct 01', spend: 2800, revenue: 9800, roas: 3.5 },
  { date: 'Oct 07', spend: 3200, revenue: 12400, roas: 3.8 },
  { date: 'Oct 14', spend: 3100, revenue: 13900, roas: 4.4 },
  { date: 'Oct 21', spend: 3900, revenue: 18200, roas: 4.6 },
  { date: 'Oct 28', spend: 3600, revenue: 17800, roas: 4.9 },
  { date: 'Nov 04', spend: 4100, revenue: 21500, roas: 5.2 },
  { date: 'Nov 11', spend: 4400, revenue: 24800, roas: 5.6 },
];

export const SparklinePerformanceChart: React.FC<SparklineChartProps> = ({
  data = defaultPerformanceData,
  height = 300,
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0C65F4" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#593090" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0C65F4" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E37C33" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#E37C33" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const revenue = payload[0]?.value as number;
                const spend = payload[1]?.value as number;
                const currentRoas = spend > 0 ? (revenue / spend).toFixed(2) : '0';
                return (
                  <div className="bg-sparkline-midnight border border-sparkline-slate text-white p-3.5 rounded-xl shadow-premium text-xs">
                    <p className="font-semibold text-slate-300 mb-1.5">{label}</p>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-sparkline-cyan flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sparkline-cyan" />
                        Predicted Revenue:
                      </span>
                      <span className="font-bold">${revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-sparkline-orange flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sparkline-orange" />
                        Ad Spend:
                      </span>
                      <span className="font-bold">${spend.toLocaleString()}</span>
                    </div>
                    <div className="pt-1.5 mt-1.5 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-slate-400">Effective ROAS:</span>
                      <span className="font-bold text-emerald-400">{currentRoas}x</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0C65F4"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#revenueGrowthGradient)"
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="spend"
            stroke="#E37C33"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#spendGradient)"
            name="Ad Spend"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MiniSparkline: React.FC<{
  data: number[];
  color?: string;
  isPositive?: boolean;
}> = ({ data, color, isPositive = true }) => {
  const chartColor = color || (isPositive ? '#0C65F4' : '#E37C33');
  const formattedData = data.map((val, idx) => ({ idx, val }));

  return (
    <div className="w-24 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id={`miniGrad-${chartColor}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="val"
            stroke={chartColor}
            strokeWidth={2}
            fill={`url(#miniGrad-${chartColor})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

