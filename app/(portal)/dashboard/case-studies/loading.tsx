export default function CaseStudiesLoading() {
    return (
        <div className="space-y-8 animate-pulse text-white">
            <div className="flex justify-between items-center">
                <div className="space-y-3">
                    <div className="h-9 w-48 bg-white/10 rounded-xl"></div>
                    <div className="h-4 w-64 bg-white/5 rounded-lg"></div>
                </div>
                <div className="h-12 w-36 bg-white/10 rounded-full"></div>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="h-16 bg-white/[0.02] border-b border-white/5"></div>
                <div className="divide-y divide-white/5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="px-8 py-8 flex items-center justify-between">
                            <div className="flex-1 space-y-3">
                                <div className="h-4 w-1/3 bg-white/10 rounded-lg"></div>
                                <div className="h-3 w-1/4 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="h-6 w-20 bg-white/5 rounded-full mx-4"></div>
                            <div className="h-4 w-24 bg-white/5 rounded-full mx-4"></div>
                            <div className="flex space-x-3">
                                <div className="h-9 w-9 bg-white/5 rounded-xl"></div>
                                <div className="h-9 w-9 bg-white/5 rounded-xl"></div>
                                <div className="h-9 w-9 bg-white/5 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
