import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-agency-black border-t border-white/10 pt-20 pb-10">
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <Image
                                src="/Main-Logo.png"
                                alt="Code & Cognition Logo"
                                width={32}
                                height={32}
                                className="w-auto h-8"
                            />
                            <span className="text-2xl font-display font-bold tracking-tight">
                                Code<span className="text-agency-accent">&</span>Cognition
                            </span>
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-8">
                            We build digital products that think. Combining aesthetics with intelligence to craft world-class web experiences.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {[
                                {
                                    name: "Email",
                                    href: "mailto:codencognition.bd@gmail.com",
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "YouTube",
                                    href: "https://www.youtube.com/@CodeNCognitionBD",
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "LinkedIn",
                                    href: "https://www.linkedin.com/company/codencognition",
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.205 24 24 23.227 24 22.271V1.729C24 .774 23.205 0 22.225 0z" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "Instagram",
                                    href: "https://www.instagram.com/codencognition.bd/",
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "Facebook",
                                    href: "https://www.facebook.com/CodeNCognition",
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "Threads",
                                    href: "https://www.threads.com/@codencognition.bd",
                                    icon: (
                                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                                            <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
                                        </svg>
                                    ),
                                },
                                {
                                    name: "X",
                                    href: "https://x.com/codencognition",
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
                                        </svg>
                                    ),
                                },
                            ].map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-agency-accent hover:text-white transition-colors cursor-pointer group"
                                    title={social.name}
                                >
                                    <div className="text-gray-400 group-hover:text-white transition-colors">
                                        {social.icon}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Explore</h4>
                        <ul className="space-y-4">
                            <li><Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link></li>
                            <li><Link href="/#services" className="text-gray-400 hover:text-white transition-colors">All Services</Link></li>
                            <li><Link href="/#process" className="text-gray-400 hover:text-white transition-colors">Our Process</Link></li>
                            <li><Link href="/#contact" className="text-gray-400 hover:text-white transition-colors">Start a Project</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© {currentYear} Code & Cognition. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
