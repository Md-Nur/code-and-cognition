"use client";

import ReactMarkdown from "react-markdown";
import { Quote, Sparkles, CheckCircle2 } from "lucide-react";
import remarkGfm from "remark-gfm";

interface PremiumMarkdownProps {
    content: string;
    className?: string; // Optional wrapper styles if needed
}

export function PremiumMarkdown({ content, className = "" }: PremiumMarkdownProps) {
    return (
        <div className={`premium-markdown font-sans ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => (
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-16 mb-8 leading-tight flex items-center gap-4" {...props}>
                            <span className="w-8 h-1 bg-agency-accent inline-block rounded-full"></span>
                            {props.children}
                        </h1>
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-14 mb-6 leading-tight border-b border-white/10 pb-4" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mt-10 mb-4 flex items-center gap-3" {...props}>
                            <Sparkles className="w-5 h-5 text-agency-accent" />
                            {props.children}
                        </h3>
                    ),
                    p: ({ node, ...props }) => (
                        <p className="text-lg text-gray-400 leading-relaxed mb-6 font-medium" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                        <a
                            className="text-agency-accent relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-agency-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left hover:text-white transition-colors cursor-pointer"
                            target="_blank"
                            rel="noreferrer"
                            {...props}
                        />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="relative my-10 p-8 md:p-10 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-2xl overflow-hidden group"
                            {...props}
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-agency-accent group-hover:w-2 transition-all duration-300" />
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-agency-accent/10 flex items-center justify-center text-agency-accent relative z-10">
                                <Quote className="w-6 h-6 rotate-180" />
                            </div>
                            <div className="text-xl md:text-2xl text-white/90 leading-relaxed italic relative z-10 font-medium font-serif">
                                {props.children}
                            </div>
                            {/* Decorative background blur */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-agency-accent/5 rounded-full blur-3xl group-hover:bg-agency-accent/10 transition-colors duration-700 pointer-events-none" />
                        </blockquote>
                    ),
                    code: ({ node, inline, ...props }: any) => {
                        if (inline) {
                            return (
                                <code className="px-2 py-1 bg-agency-accent/10 text-agency-accent rounded-md font-mono text-[0.9em] font-semibold tracking-tight border border-agency-accent/20 shadow-[0_0_10px_rgba(255,255,255,0.02)]" {...props} />
                            );
                        }
                        return (
                            <code className="text-[0.9em] font-mono leading-loose text-gray-300" {...props} />
                        );
                    },
                    pre: ({ node, ...props }) => (
                        <div className="my-10 relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                            {/* Mac-style window controls */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <div className="ml-2 text-xs text-gray-500 font-mono">Code Snippet</div>
                            </div>
                            <pre className="p-6 overflow-x-auto custom-scrollbar" {...props} />
                        </div>
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="my-8 space-y-4" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="my-8 space-y-4 list-decimal list-inside text-gray-400 text-lg font-medium marker:text-agency-accent marker:font-bold" {...props} />
                    ),
                    li: ({ node, ...props }) => {
                        // Check if it's inside a ul or an ol
                        // react-markdown doesn't pass the parent type directly in simple ways to li without extra effort, 
                        // so we can use a structural approach or just provide a Custom check.
                        // For simplicity, we can apply a custom bullet for all `li` inside `ul` by using child targeting in CSS,
                        // but since we want premium React elements, let's style the li itself.
                        // We will allow regular children rendering but prepend a custom icon manually if it's a ul item.
                        // Actually, using Tailwind peer/class on UL/OL is safer, but let's just use CSS-in-JS flex layout:
                        return (
                            <li className="flex items-start gap-4 text-lg text-gray-400 leading-relaxed group" {...props}>
                                <div className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-agency-accent/50 group-hover:bg-agency-accent transition-colors shadow-[0_0_8px_rgba(var(--agency-accent),0.5)] hidden xl:block" />
                                {/* On smaller screens we might just use standard bullets if flex gets weird, but this works well */}
                                <div>{props.children}</div>
                            </li>
                        );
                    },
                    strong: ({ node, ...props }) => (
                        <strong className="font-bold text-white tracking-tight relative z-10" {...props} />
                    ),
                    img: ({ node, ...props }) => (
                        <span className="block my-14 relative group rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                            <img className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]" {...props} />
                            {/* Subtle overlay shine */}
                            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </span>
                    ),
                    hr: ({ node, ...props }) => (
                        <div className="my-16 relative">
                            <hr className="border-t border-white/10 relative overflow-visible" {...props} />
                            {/* Decorative center element */}
                            <div className="absolute left-1/2 -top-3 w-6 h-6 bg-[#050505] -translate-x-1/2 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-agency-accent"></div>
                            </div>
                        </div>
                    ),
                    table: ({ node, ...props }) => (
                        <div className="my-10 w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                            <table className="w-full text-left text-sm text-gray-400" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-white/[0.05] text-white font-semibold uppercase tracking-wider text-xs border-b border-white/10" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-6 py-4" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-6 py-4 border-b border-white/5 last:border-0" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
