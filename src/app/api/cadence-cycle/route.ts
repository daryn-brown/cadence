import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { contractId: string } }) {
    const { contractId } = params;

    const cycles = await prisma.connectCycle.findMany({
        where: { contractId: Number(contractId) },
        include: { reflections: true },
    });

    const goals = await prisma.goal.findMany({
        where: { contractId: Number(contractId) },
    });

    const peerFeedbacks = await prisma.peerFeedback.findMany({
        where: { contractId: Number(contractId) },
    });

    return NextResponse.json({ cycles, goals, peerFeedbacks });
}