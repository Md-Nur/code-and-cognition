"use client";

import { useState } from "react";
import { Service } from "@prisma/client";

// Partial type for frontend display since we might not fetch everything
type ServiceType = Pick<Service, "id" | "title" | "description" | "basePriceBDT" | "basePriceUSD" | "thumbnailUrl"> & {
    subCategories: { id: string, title: string }[]
};

export default function ServicesGrid({ initialServices }: { initialServices: ServiceType[] }) {
    const [services] = useState<ServiceType[]>(initialServices);
    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Starting at</span>
            <div className="text-xl font-bold text-agency-accent">
                ৳{service.basePriceBDT.toLocaleString()}
            </div>
        </div>

        <button className="btn-ghost p-2 rounded-full hover:bg-agency-accent hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </button>
    </div>
                    </div >
                ))
}
            </div >
        </section >
    );
}
