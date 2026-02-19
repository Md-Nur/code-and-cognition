"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    description?: string;
}

export default function ImageUpload({ value, onChange, label, description }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onChange(data.imageUrl);
            } else {
                alert("Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading image");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    return (
        <div className="space-y-3">
            {label && <label className="input-label">{label}</label>}
            {description && <p className="text-[10px] text-gray-500 italic mb-2">{description}</p>}

            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input-field flex-1"
                        placeholder="Image URL (direct link or upload below)"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn-brand whitespace-nowrap px-4 py-2 text-xs"
                    >
                        {uploading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Uploading...
                            </span>
                        ) : (
                            "Upload Image"
                        )}
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {value && (
                    <div className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-white/5">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/101010/404040?text=Invalid+Image+URL";
                            }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
