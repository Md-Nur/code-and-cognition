export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-agency-black flex items-center justify-center relative overflow-hidden">
            {/* Shared background for auth pages */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-agency-accent/10 rounded-full blur-[120px] opacity-30" />
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
