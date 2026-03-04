'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CategoryFilterProps {
    categories: string[];
    onFilterChange: (category: string, search: string) => void;
}

export default function CategoryFilter({ categories, onFilterChange }: CategoryFilterProps) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        onFilterChange(selectedCategory, searchQuery);
    }, [selectedCategory, searchQuery, onFilterChange]);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                {['All', ...categories].map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${selectedCategory === category
                                ? 'bg-agency-accent border-agency-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-agency-accent transition-colors" />
                <input
                    type="text"
                    placeholder="Search insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-agency-accent/50 focus:bg-white/[0.08] transition-all duration-300"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-3 h-3 text-gray-500 hover:text-white" />
                    </button>
                )}
            </div>
        </div>
    );
}
