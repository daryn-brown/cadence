import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        // Get all contracts with their relationships
        const contracts = await prisma.contract.findMany({
            include: {
                contractor: true,
                manager: true,
                connectCycles: true,
                goals: true,
            },
        });

        return NextResponse.json({
            success: true,
            contracts,
            count: contracts.length,
        });
    } catch (error) {
        console.error("Error fetching contracts:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
} 