import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContractorCommentNotification } from "@/lib/email";

export async function POST(
    request: NextRequest,
    { params }: { params: { contractId: string; cycleId: string } }
) {
    try {
        const body = await request.json();
        const { content, authorId } = body;

        const comment = await prisma.comment.create({
            data: {
                connectCycleId: parseInt(params.cycleId),
                authorId,
                content,
            },
            include: {
                author: true,
                connectCycle: {
                    include: {
                        contract: {
                            include: {
                                contractor: true,
                            },
                        },
                    },
                },
            },
        });

        // Send email notification to contractor
        try {
            if (comment.connectCycle.contract) {
                await sendContractorCommentNotification(
                    comment.connectCycle.contract.contractor.email,
                    comment.connectCycle.contract.contractor.name || comment.connectCycle.contract.contractor.email,
                    comment.author.name || comment.author.email,
                    params.contractId,
                    params.cycleId,
                    content
                );
            }
        } catch (emailError) {
            console.error("Error sending email notification:", emailError);
            // Don't fail the entire request if email fails
        }

        return NextResponse.json({
            success: true,
            comment,
            message: "Comment added successfully",
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json(
            { error: "Failed to add comment" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { contractId: string; cycleId: string } }
) {
    try {
        const comments = await prisma.comment.findMany({
            where: { connectCycleId: parseInt(params.cycleId) },
            include: { author: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
} 