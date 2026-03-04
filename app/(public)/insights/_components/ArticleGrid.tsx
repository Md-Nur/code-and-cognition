'use client';

import Link from "next/link";
import { MoveRight, Clock, Search } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from 'react';
import CategoryFilter from "./CategoryFilter";

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string;
    thumbnailUrl: string | null;
    isFeatured: boolean;
    publishedAt: Date;
    content: string;
}

interface ArticleGridProps {
    initialArticles: Article[];
}

export default function ArticleGrid({ initialArticles }: ArticleGridProps) {
    const [filter, setFilter] = useState({ category: 'All', search: '' });

    const filteredArticles = useMemo(() => {
        return initialArticles.filter(article => {
            const matchesCategory = filter.category === 'All' || article.category === filter.category;
            const matchesSearch = article.title.toLowerCase().includes(filter.search.toLowerCase()) ||
                (article.excerpt?.toLowerCase().includes(filter.search.toLowerCase()) ?? false);
            return matchesCategory && matchesSearch;
        });
    }, [initialArticles, filter]);

    const categories = useMemo(() => {
        return Array.from(new Set(initialArticles.map(a => a.category)));
    }, [initialArticles]);

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const onFilterChange = (category: string, search: string) => {
        setFilter({ category, search });
    };

    return (
        <>
            <CategoryFilter categories={categories} onFilterChange={onFilterChange} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                    <Link
                        key={article.id}
                        href={`/insights/${article.slug}`}
                        className="group block premium-card p-4 h-full flex flex-col"
                    >
                        <div className="mb-6 overflow-hidden rounded-2xl aspect-[16/10] bg-white/5 border border-white/5 relative">
                            {article.thumbnailUrl ? (
                                <Image
                                    src={article.thumbnailUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
                                    <span className="text-white/5 font-bold uppercase tracking-[0.5em] text-xs">Insight</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-agency-accent text-[9px] font-bold uppercase tracking-widest">
                                    {article.category}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {calculateReadTime(article.content)} min read
                                </span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-agency-accent transition-colors line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 mb-auto">
                                {article.excerpt || "Exploring technical excellence and strategic digital transformation."}
                            </p>

                            <Link href={`/insights/${article.slug}`} className="flex items-center gap-2 text-white/40 group-hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                                Full Analysis <MoveRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </Link>
                )) : (
                    <div className="lg:col-span-3 text-center py-20 border-2 border-dashed border-white/5 rounded-[40px]">
                        <div className="mb-4 flex justify-center">
                            <Search className="w-12 h-12 text-white/10" />
                        </div>
                        <p className="text-gray-500 font-medium">No matches found for your search. Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </>
    );
}
