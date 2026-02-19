import Link from "next/link";

interface SubCategoryCardProps {
    serviceId: string;
    subCategory: {
        id: string;
        title: string;
        description: string | null;
        imageUrl: string | null;
        basePriceBDT: number;
        basePriceUSD: number;
    };
}

export default function SubCategoryCard({ serviceId, subCategory }: SubCategoryCardProps) {
    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col h-full group hover:border-agency-accent/50 transition-all border border-white/5">
            {/* Thumbnail */}
            <div className="mb-6 overflow-hidden rounded-xl bg-white/5 aspect-video relative">
                {subCategory.imageUrl ? (
                    <img
                        src={subCategory.imageUrl}
                        alt={subCategory.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 font-bold text-3xl uppercase tracking-tighter">
                        {subCategory.title[0]}
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold mb-2">{subCategory.title}</h3>
            {subCategory.description && (
                <p className="text-gray-400 mb-6 text-sm line-clamp-2">{subCategory.description}</p>
            )}

            <div className="mt-auto">
                <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block mb-1">Starting from</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-agency-accent">৳{subCategory.basePriceBDT.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">${subCategory.basePriceUSD}</span>
                    </div>
                </div>

                <Link
                    href={`/services/${serviceId}/${subCategory.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold bg-white/5 border border-white/10 hover:bg-agency-accent hover:text-white transition-all"
                >
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
