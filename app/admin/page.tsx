import { Suspense } from "react";
import { ExecutiveOverview } from "@/app/components/admin/ExecutiveOverview";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">Welcome back, Founder.</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <ExecutiveOverview />
      </Suspense>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl min-h-75 flex items-center justify-center border-dashed border-2 border-white/10">
          <p className="text-gray-500">Revenue Analytics Chart (Coming Soon)</p>
        </div>
        <div className="glass-panel p-6 rounded-xl min-h-75 flex items-center justify-center border-dashed border-2 border-white/10">
          <p className="text-gray-500">
            Project Distribution Chart (Coming Soon)
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="glass-panel p-6 rounded-xl animate-pulse flex flex-col justify-between h-[120px]"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-24 bg-white/5 rounded" />
              <div className="h-8 w-8 bg-white/5 rounded-lg" />
            </div>
            <div className="h-8 w-32 bg-white/10 rounded" />
          </div>
        ))}
    </div>
  );
}
