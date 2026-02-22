import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import ProposalForm from "@/app/components/portal/ProposalForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProposalPage({
    searchParams,
}: {
    searchParams: Promise<{ bookingId?: string }>;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");
    if (session.user.role !== Role.FOUNDER) redirect("/dashboard");

    const { bookingId } = await searchParams;

    if (!bookingId) {
        return (
            <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-3xl border border-dashed border-white/10 text-center">
                <p className="text-gray-500 mb-6">No booking selected. Proposals must be created from a booking request.</p>
                <Link href="/dashboard/bookings" className="btn-brand px-8 py-3">
                    Go to Bookings
                </Link>
            </div>
        );
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { service: true }
    });

    if (!booking) {
        return (
            <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-3xl border border-dashed border-white/10 text-center">
                <p className="text-gray-500 mb-6">Booking not found.</p>
                <Link href="/dashboard/bookings" className="btn-brand px-8 py-3">
                    Go to Bookings
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/bookings" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-white">Create Proposal</h1>
                    <p className="text-gray-500 text-sm mt-1">For {booking.clientName} — {booking.service?.title || "Custom Service"}</p>
                </div>
            </div>

            <ProposalForm booking={booking as any} />
        </div>
    );
}
