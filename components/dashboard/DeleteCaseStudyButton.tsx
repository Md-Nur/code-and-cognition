"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCaseStudy } from "@/app/actions/casestudy";

export function DeleteCaseStudyButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this case study? This action cannot be undone.")) {
            setIsDeleting(true);
            await deleteCaseStudy(id);
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    );
}
