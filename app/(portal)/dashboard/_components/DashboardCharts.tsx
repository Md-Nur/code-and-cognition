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

export interface RevenueData {
    month: string;
    bdt: number;
    usd: number;
}

interface RevenueChartProps {
    data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-[250px] w-full flex items-center justify-center text-gray-500 text-sm">No revenue data available</div>;
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
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px" }} />
                    <Bar dataKey="bdt" name="Revenue (BDT)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="usd" name="Revenue (USD)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export interface ProjectData {
    name: string;
    value: number;
    color: string;
}

interface ProjectVelocityChartProps {
    data: ProjectData[];
}

export function ProjectVelocityChart({ data }: ProjectVelocityChartProps) {
    if (!data || data.length === 0) {
        return <div className="h-[250px] w-full flex items-center justify-center text-gray-500 text-sm">No project data available</div>;
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
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '16px' }}
                        itemStyle={{ color: '#e5e7eb' }}
                    />
                    <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
