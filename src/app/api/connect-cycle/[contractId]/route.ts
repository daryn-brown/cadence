import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
    sendInitialConnectConfirmation,
    sendManagerNotification,
    sendMidpointConnectNotification,
    sendFinalConnectNotification,
} from "@/lib/email";

export async function GET(
    request: NextRequest,
    { params }: { params: { contractId: string } }
) {
    try {
        console.log("Fetching connect cycles for contract:", params.contractId);

        const connectCycles = await prisma.connectCycle.findMany({
            where: { contractId: parseInt(params.contractId) },
            include: {
                reflections: true,
                comments: {
                    include: {
                        author: true,
                    },
                },
            },
        });

        console.log("Found connect cycles:", connectCycles.length);
        return NextResponse.json({ cycles: connectCycles });
    } catch (error) {
        console.error("Error fetching connect cycles:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch connect cycles",
                details: error instanceof Error ? error.message : "Unknown error",
                contractId: params.contractId
            },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { contractId: string } }
) {
    try {
        const body = await request.json();
        const contractId = parseInt(params.contractId);

        // Get contract details
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            include: { contractor: true, manager: true },
        });

        if (!contract) {
            return NextResponse.json(
                { error: "Contract not found" },
                { status: 404 }
            );
        }

        // Check if connect cycle already exists
        let connectCycle = await prisma.connectCycle.findFirst({
            where: {
                contractId,
                type: body.type,
            },
        });

        if (connectCycle) {
            // Update existing connect cycle
            connectCycle = await prisma.connectCycle.update({
                where: { id: connectCycle.id },
                data: {
                    status: "COMPLETE",
                    completedAt: new Date(),
                },
            });
        } else {
            // Create new connect cycle
            connectCycle = await prisma.connectCycle.create({
                data: {
                    contractId,
                    type: body.type,
                    status: "COMPLETE",
                    completedAt: new Date(),
                },
            });
        }

        // Create reflections
        if (body.reflections && body.reflections.length > 0) {
            await Promise.all(
                body.reflections.map((reflection: { question: string; response: string }) =>
                    prisma.reflection.create({
                        data: {
                            connectCycleId: connectCycle.id,
                            question: reflection.question,
                            response: reflection.response,
                        },
                    })
                )
            );
        }

        // Create goals
        if (body.goals && body.goals.length > 0) {
            await Promise.all(
                body.goals.map((goal: { description: string; metric: string }) =>
                    prisma.goal.create({
                        data: {
                            contractId,
                            description: goal.description,
                            metric: goal.metric,
                            status: "ON_TRACK",
                        },
                    })
                )
            );
        }

        // Send email notifications based on connect type
        try {
            if (body.type === "INITIAL") {
                // Extract form data for email
                const formData = {
                    goals: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("challenges"))?.response || "",
                    expectations: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("expectations"))?.response || "",
                    resources: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("support"))?.response || "",
                };

                // Send confirmation to contractor
                await sendInitialConnectConfirmation(
                    contract.contractor.email,
                    contract.contractor.name || contract.contractor.email,
                    contractId.toString(),
                    formData
                );

                // Send notification to manager
                await sendManagerNotification(
                    contract.manager.email,
                    contract.manager.name || contract.manager.email,
                    contract.contractor.name || contract.contractor.email,
                    contractId.toString(),
                    connectCycle.id.toString(),
                    formData
                );
            } else if (body.type === "MIDPOINT") {
                // Extract form data for email
                const formData = {
                    progress: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("progress"))?.response || "",
                    challenges: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("challenges"))?.response || "",
                    adjustments: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("adjustments"))?.response || "",
                };

                // Send confirmation to contractor
                await sendMidpointConnectNotification(
                    contract.contractor.email,
                    contract.contractor.name || contract.contractor.email,
                    contract.manager.email,
                    contract.manager.name || contract.manager.email,
                    contractId.toString(),
                    formData
                );

                // Send notification to manager
                await sendManagerNotification(
                    contract.manager.email,
                    contract.manager.name || contract.manager.email,
                    contract.contractor.name || contract.contractor.email,
                    contractId.toString(),
                    connectCycle.id.toString(),
                    formData
                );
            } else if (body.type === "FINAL") {
                // Extract form data for email
                const formData = {
                    achievements: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("achievements"))?.response || "",
                    feedback: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("feedback"))?.response || "",
                    lessons: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("lessons"))?.response || "",
                    recommendations: body.reflections?.find((r: { question: string; response: string }) => r.question.includes("recommendations"))?.response || "",
                };

                // Send confirmation to contractor
                await sendFinalConnectNotification(
                    contract.contractor.email,
                    contract.contractor.name || contract.contractor.email,
                    contract.manager.email,
                    contract.manager.name || contract.manager.email,
                    contractId.toString(),
                    formData
                );

                // Send notification to manager
                await sendManagerNotification(
                    contract.manager.email,
                    contract.manager.name || contract.manager.email,
                    contract.contractor.name || contract.contractor.email,
                    contractId.toString(),
                    connectCycle.id.toString(),
                    formData
                );
            }
        } catch (emailError) {
            console.error("Error sending email notifications:", emailError);
            // Don't fail the entire request if emails fail
        }

        return NextResponse.json({
            success: true,
            connectCycle,
            message: "Connect cycle submitted successfully",
        });
    } catch (error) {
        console.error("Error submitting connect cycle:", error);
        return NextResponse.json(
            {
                error: "Failed to submit connect cycle",
                details: error instanceof Error ? error.message : "Unknown error",
                contractId: params.contractId
            },
            { status: 500 }
        );
    }
} 