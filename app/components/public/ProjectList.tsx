"use client";

import { useState } from "react";
import Image from "next/image";

type Project = {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    projectUrl: string | null;
    serviceId: string;
    service: { title: string };
    technologies: string[];
};

type Service = {
    id: string;
    title: string;
};

export default function ProjectList({
    initialProjects,
    services
}: {
    initialProjects: Project[],
    services: Service[]
}) {
    const [selectedService, setSelectedService] = useState<string>("all");

    const filteredProjects = selectedService === "all"
        ? initialProjects
        : initialProjects.filter(p => p.serviceId === selectedService);

    return (
        <div className="section-container mb-20">
            <div className="max-w-3xl mb-12">
                <span className="section-tag mb-4">Our Work</span>
                <h1 className="text-5xl font-bold tracking-tight mb-6">Selected Projects</h1>
                <p className="text-xl text-gray-400">
                    A showcase of digital products we've built for ambitious brands across the globe.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-12">
                <button
                    onClick={() => setSelectedService("all")}
                    className={`px-6 py-2 rounded-full border transition-all ${selectedService === "all"
                        ? "bg-agency-accent border-agency-accent text-white"
                        : "border-white/10 text-gray-400 hover:border-white/30"
                        }`}
                >
                    All Projects
                </button>
                {services.map(service => (
                    <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`px-6 py-2 rounded-full border transition-all ${selectedService === service.id
                            ? "bg-agency-accent border-agency-accent text-white"
                            : "border-white/10 text-gray-400 hover:border-white/30"
                            }`}
                    >
                        {service.title}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map(project => (
                    <div key={project.id} className="group relative glass-panel rounded-2xl overflow-hidden hover:border-agency-accent/50 transition-colors">
                        <div className="aspect-video relative bg-white/5 overflow-hidden">
                            {project.imageUrl ? (
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/5 text-8xl font-bold">
                                    {project.title.charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-agency-black/60 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                {project.projectUrl && (
                                    <a
                                        href={project.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-brand"
                                    >
                                        View Live Site
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs uppercase tracking-widest font-bold text-agency-accent">
                                    {project.service.title}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <div className="flex gap-2">
                                    {project.technologies.slice(0, 3).map(tech => (
                                        <span key={tech} className="text-[10px] text-gray-500 uppercase font-semibold">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                            <p className="text-gray-400 mb-6 line-clamp-2">
                                {project.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-40 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-gray-500">No projects found for this category yet.</p>
                </div>
            )}
        </div>
    );
}
