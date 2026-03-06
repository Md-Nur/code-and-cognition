"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell
} from "recharts";

export interface ExpenseData {
    category: string;
    amount: number;
    color: string;
}

interface ExpenseAnalyticsChartProps {
    data: ExpenseData[];
}

export function ExpenseAnalyticsChart({ data }: ExpenseAnalyticsChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-[250px] w-full flex items-center justify-center text-gray-500 text-sm">No expense data available</div>;
    }

    return (
        <div className="h-[250px] w-full mt-4 text-xs font-sans">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                        stroke="none"
                        nameKey="category"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '16px' }}
                        itemStyle={{ color: '#e5e7eb' }}
                        formatter={(value: any) => [`৳${Number(value || 0).toLocaleString()}`, "Amount (BDT)"]}
                    />
                    <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export interface ProfitData {
    month: string;
    profit: number;
}

interface CompanyProfitChartProps {
    data: ProfitData[];
}

export function CompanyProfitChart({ data }: CompanyProfitChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-[250px] w-full flex items-center justify-center text-gray-500 text-sm">No profit data available</div>;
    }

    return (
        <div className="h-[250px] w-full mt-4 text-xs font-sans">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                    <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '16px' }}
                        itemStyle={{ color: '#e5e7eb' }}
                        formatter={(value: any) => [`৳${Number(value || 0).toLocaleString()}`, "Company Revenue (BDT)"]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
                    <Bar dataKey="profit" name="Company Revenue (BDT)" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={16}>
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? "#06b6d4" : "#ef4444"} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
