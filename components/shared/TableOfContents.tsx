"use client";

import { useEffect, useState } from "react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents() {
    const [toc, setToc] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const headings = Array.from(document.querySelectorAll(".premium-markdown h2, .premium-markdown h3"));
        const items = headings.map((heading) => {
            const text = heading.textContent || "";
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            heading.id = id;
            return {
                id,
                text,
                level: heading.tagName === "H2" ? 2 : 3,
            };
        });
        setToc(items);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0% 0% -80% 0%" }
        );

        headings.forEach((heading) => observer.observe(heading));
        return () => observer.disconnect();
    }, []);

    if (toc.length === 0) return null;

    return (
        <nav className="flex flex-col gap-4">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-2 px-4">On this page</h3>
            <ul className="space-y-1">
                {toc.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className={`block py-1.5 px-4 text-xs font-medium transition-all border-l-2 ${activeId === item.id
                                    ? "text-agency-accent border-agency-accent bg-agency-accent/5"
                                    : "text-gray-500 border-transparent hover:text-gray-300 hover:border-white/10"
                                } ${item.level === 3 ? "pl-8 text-[11px]" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
