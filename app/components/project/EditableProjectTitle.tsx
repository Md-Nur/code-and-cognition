"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Role } from "@prisma/client";

const titleSchema = z.object({
    title: z.string().min(1, "Title is required"),
});

type TitleFormData = z.infer<typeof titleSchema>;

interface EditableProjectTitleProps {
    projectId: string;
    initialTitle: string;
    userRole: string;
}

export default function EditableProjectTitle({
    projectId,
    initialTitle,
    userRole
}: EditableProjectTitleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isFounder = userRole === Role.FOUNDER;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TitleFormData>({
        resolver: zodResolver(titleSchema),
        defaultValues: { title: initialTitle }
    });

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleCancel = () => {
        setIsEditing(false);
        reset({ title: title });
    };

    const onSubmit = async (data: TitleFormData) => {
        if (data.title === title) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: data.title }),
            });

            if (res.ok) {
                setTitle(data.title);
                setIsEditing(false);
            } else {
                const error = await res.json();
                alert(error.error || "Failed to update project title");
            }
        } catch (error) {
            console.error("Error updating project title:", error);
            alert("An error occurred while updating the project title");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isFounder) {
        return <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white">{title}</h1>;
    }

    if (isEditing) {
        return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-3 w-full max-w-2xl"
            >
                <div className="flex-1">
                    <input
                        {...register("title")}
                        type="text"
                        className={`w-full bg-white/5 border ${errors.title ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-2 text-2xl md:text-3xl font-display text-white focus:outline-none focus:ring-2 focus:ring-agency-accent/50 transition-all`}
                        placeholder="Project Title"
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    {errors.title && (
                        <p className="text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-1 ml-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="p-3 rounded-xl bg-agency-accent/10 border border-agency-accent/20 text-agency-accent hover:bg-agency-accent/20 transition-all disabled:opacity-50"
                        title="Save changes"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                        title="Cancel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div
            className="group relative inline-flex items-center gap-4 cursor-pointer"
            onClick={() => setIsEditing(true)}
        >
            <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white group-hover:text-agency-accent/90 transition-colors">
                {title}
            </h1>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-500 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                <Pencil className="w-4 h-4" />
            </div>
        </div>
    );
}
