import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const sendEvent = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            // Initial fetch
            try {
                const notifications = await prisma.notification.findMany({
                    where: { userId },
                    orderBy: { createdAt: "desc" },
                    take: 20,
                });
                sendEvent(notifications);
            } catch (error) {
                console.error("SSE Initial fetch error:", error);
            }

            // Polling loop within the SSE connection
            const interval = setInterval(async () => {
                try {
                    const notifications = await prisma.notification.findMany({
                        where: { userId },
                        orderBy: { createdAt: "desc" },
                        take: 20,
                    });
                    sendEvent(notifications);
                } catch (error) {
                    console.error("SSE loop error:", error);
                }
            }, 5000); // Check every 5 seconds (much more responsive than 30s)

            // Cleanup when the connection is closed
            req.signal.addEventListener("abort", () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
}
