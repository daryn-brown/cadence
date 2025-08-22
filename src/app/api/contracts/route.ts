import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const { contractorId, managerId, startDate, endDate } = await request.json();

    const contract = await prisma.contract.create({
        data: {
            contractorId,
            managerId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: "ACTIVE",
        },
        include: {
            contractor: true,
            manager: true,
        },
    });

    return NextResponse.json({ contract });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
        return NextResponse.json({ error: 'userId and role required' }, { status: 400 });
    }

    let contracts;

    if (role === 'MANAGER') {
        contracts = await prisma.contract.findMany({
            where: { managerId: userId },
            include: {
                contractor: true,
                connectCycles: true,
                goals: true,
            },
        });
    } else if (role === 'CONTRACTOR') {
        contracts = await prisma.contract.findMany({
            where: { contractorId: userId },
            include: {
                manager: true,
                connectCycles: true,
                goals: true,
            },
        });
    }

    return NextResponse.json({ contracts });
} 