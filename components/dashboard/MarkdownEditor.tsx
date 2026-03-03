"use client";

import { useState } from "react";
import { PremiumMarkdown } from "@/components/shared/PremiumMarkdown";
import { Bold, Italic, List, ListOrdered, Link, Eye, Code as CodeIcon, Type } from "lucide-react";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    rows?: number;
    error?: string;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder,
    label,
    rows = 6,
    error
}: MarkdownEditorProps) {
    const [isPreview, setIsPreview] = useState(false);

    const insertText = (before: string, after: string = "") => {
        const textarea = document.activeElement as HTMLTextAreaElement;
        if (!textarea || textarea.tagName !== "TEXTAREA") return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
        onChange(newText);

        // Reset focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + before.length,
                end + before.length
            );
        }, 0);
    };

    const formatActions = [
        { icon: Bold, action: () => insertText("**", "**"), label: "Bold" },
        { icon: Italic, action: () => insertText("_", "_"), label: "Italic" },
        { icon: List, action: () => insertText("- "), label: "Bullet List" },
        { icon: ListOrdered, action: () => insertText("1. "), label: "Numbered List" },
        { icon: Link, action: () => insertText("[", "](url)"), label: "Link" },
        { icon: CodeIcon, action: () => insertText("`", "`"), label: "Inline Code" },
    ];

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-4">
                {label && (
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        {label}
                    </label>
                )}
                <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-agency-accent hover:text-white transition-colors"
                >
                    {isPreview ? (
                        <>
                            <Type className="w-3 h-3" />
                            Edit Mode
                        </>
                    ) : (
                        <>
                            <Eye className="w-3 h-3" />
                            Preview Mode
                        </>
                    )}
                </button>
            </div>

            <div className="relative group rounded-2xl overflow-hidden border border-white/5 bg-white/5 focus-within:border-agency-accent/50 transition-all">
                {!isPreview && (
                    <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-black/20">
                        {formatActions.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={item.action}
                                title={item.label}
                                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                            >
                                <item.icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                )}

                {isPreview ? (
                    <div className={`p-4 overflow-y-auto min-h-[${rows * 24}px] bg-black/40`}>
                        {value ? (
                            <PremiumMarkdown content={value} />
                        ) : (
                            <p className="text-gray-500 italic">Nothing to preview</p>
                        )}
                    </div>
                ) : (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={rows}
                        className="w-full bg-transparent px-4 py-4 text-gray-300 placeholder:text-gray-600 focus:outline-none resize-none scrollbar-hide font-mono text-sm leading-relaxed"
                    />
                )}
            </div>
            {error && (
                <p className="text-xs text-red-400 mt-2 ml-4">{error}</p>
            )}
        </div>
    );
}
