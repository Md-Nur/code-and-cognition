export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-2">Welcome back, Founder.</p>
                </div>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue (BDT)", value: "৳2,450,000", trend: "+12.5%", color: "text-green-400" },
                    { label: "Active Projects", value: "12", trend: "3 this month", color: "text-blue-400" },
                    { label: "Pending Bookings", value: "5", trend: "+2 today", color: "text-yellow-400" },
                    { label: "Company Fund (USD)", value: "$12,450", trend: "+5.2%", color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-xl hover:border-white/20 transition-colors">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
                        <div className="flex items-end justify-between">
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <div className={`text-sm font-medium ${stat.color} bg-white/5 px-2 py-1 rounded-md`}>
                                {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for future charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl min-h-[400px] flex items-center justify-center border-dashed border-2 border-white/10">
                    <p className="text-gray-500">Revenue Analytics Chart (Coming Soon)</p>
                </div>
                <div className="glass-panel p-6 rounded-xl min-h-[400px] flex items-center justify-center border-dashed border-2 border-white/10">
                    <p className="text-gray-500">Project Distribution Chart (Coming Soon)</p>
                </div>
            </div>
        </div>
    );
}
