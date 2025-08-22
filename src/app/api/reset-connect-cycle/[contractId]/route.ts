import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { contractId: string } }
) {
    try {
        const contractId = parseInt(params.contractId);

        // First, get all connect cycles for this contract
        const connectCycles = await prisma.connectCycle.findMany({
            where: { contractId },
            select: { id: true },
        });

        // Delete comments for all connect cycles
        for (const cycle of connectCycles) {
            await prisma.comment.deleteMany({
                where: { connectCycleId: cycle.id },
            });
        }

        // Delete reflections for all connect cycles
        for (const cycle of connectCycles) {
            await prisma.reflection.deleteMany({
                where: { connectCycleId: cycle.id },
            });
        }

        // Now delete the connect cycles
        await prisma.connectCycle.deleteMany({
            where: { contractId },
        });

        // Delete all goals for this contract
        await prisma.goal.deleteMany({
            where: { contractId },
        });

        return NextResponse.json({
            success: true,
            message: "Connect cycles and goals reset successfully",
        });
    } catch (error) {
        console.error("Error resetting connect cycles:", error);
        return NextResponse.json(
            { error: "Failed to reset connect cycles" },
            { status: 500 }
        );
    }
} 