"use client";

import ReactMarkdown from "react-markdown";

interface PremiumMarkdownProps {
    content: string;
    className?: string; // Optional wrapper styles if needed
}

export function PremiumMarkdown({ content, className = "" }: PremiumMarkdownProps) {
    return (
        <div className={`prose prose-invert max-w-none 
            prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight 
            prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
            prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-agency-accent hover:prose-a:text-white prose-a:transition-colors prose-a:underline prose-a:underline-offset-4 prose-a:decoration-agency-accent/30 hover:prose-a:decoration-agency-accent
            prose-blockquote:bg-white/[0.03] prose-blockquote:border-l-4 prose-blockquote:border-agency-accent prose-blockquote:px-8 prose-blockquote:py-6 prose-blockquote:rounded-r-3xl prose-blockquote:my-10 prose-blockquote:text-white prose-blockquote:italic
            prose-code:text-agency-accent prose-code:bg-agency-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:my-8 prose-pre:overflow-x-auto custom-scrollbar
            prose-strong:text-white prose-strong:font-semibold
            prose-ul:text-gray-400 prose-ul:my-6 prose-ol:text-gray-400 prose-ol:my-6
            prose-li:marker:text-agency-accent prose-li:marker:font-bold
            prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:my-12 
            prose-hr:border-white/10 prose-hr:my-12
            ${className}
        `}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
