import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 relative overflow-hidden">
            {/* Background Accent Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-agency-accent/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            <div className="relative flex flex-col items-center text-center max-w-lg">
                {/* Logo Section */}
                <div className="relative w-32 h-32 mb-12 animate-float">
                    <Image
                        src="/Main-Logo.png"
                        alt="Code & Cognition Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                    <div className="absolute inset-0 rounded-full bg-white/5 blur-2xl animate-pulse -z-10"></div>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-black text-gradient tracking-tighter mb-4">
                        404
                    </h1>
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Page Not Found
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
                            The coordinates you're looking for don't exist in our digital architecture.
                        </p>
                    </div>

                    <div className="pt-8">
                        <Link href="/" className="btn-brand group">
                            <span>Go Back Home</span>
                            <svg
                                className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer decoration */}
            <div className="absolute bottom-12 text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">
                Code & Cognition
            </div>
        </div>
    );
}
