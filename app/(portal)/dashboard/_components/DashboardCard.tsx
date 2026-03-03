import { ReactNode } from "react";

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: string;
        isUp: boolean;
    };
    colorClass?: string;
}

export function DashboardCard({
    title,
    value,
    icon,
    trend,
    colorClass = "text-white",
}: DashboardCardProps) {
    return (
        <div className="glass-panel p-6 rounded-xl hover:border-white/20 transition-all flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">{title}</h3>
                {icon && <div className="p-2 bg-white/5 rounded-lg text-gray-300">{icon}</div>}
            </div>
            <div>
                <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
                {trend && (
                    <div className="mt-2 text-sm flex items-center gap-1">
                        <span className={trend.isUp ? "text-green-400" : "text-red-400"}>
                            {trend.isUp ? "↑" : "↓"} {trend.value}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
