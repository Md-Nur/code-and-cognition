import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { CaseStudy } from "@/lib/data/case-studies";

interface CaseStudyCardProps {
    caseStudy: CaseStudy;
}

export default function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
    return (
        <div className="group relative flex flex-col h-full premium-card overflow-hidden">
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                    src={caseStudy.coverImage}
                    alt={caseStudy.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Industry Tag Overlay */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full">
                        {caseStudy.industry}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex flex-col flex-grow">
                {/* Highlight Metric */}
                <div className="mb-4">
                    <span className="text-agency-accent font-bold text-sm tracking-tight bg-agency-accent/5 px-3 py-1 rounded-lg border border-agency-accent/20">
                        {caseStudy.highlightMetric}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-agency-accent transition-colors">
                    {caseStudy.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2">
                    {caseStudy.summary}
                </p>

                <div className="mt-auto">
                    <Link
                        href={`/case-studies/${caseStudy.slug}`}
                        className="inline-flex items-center gap-2 text-white font-bold text-sm group/btn"
                    >
                        View Case Study
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-white group-hover/btn:text-black group-hover/btn:border-white group-hover/btn:translate-x-1">
                            <MoveRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Animated Hover Border */}
            <div className="absolute inset-0 border-2 border-agency-accent/0 rounded-3xl transition-all duration-500 group-hover:border-agency-accent/20 pointer-events-none" />
        </div>
    );
}
