import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        // Test database connection
        await prisma.$connect();

        // Try to count users
        const userCount = await prisma.user.count();

        return NextResponse.json({
            success: true,
            message: "Database connection successful",
            userCount,
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasResendKey: !!process.env.RESEND_API_KEY,
            }
        });
    } catch (error) {
        console.error("Database test error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                hasResendKey: !!process.env.RESEND_API_KEY,
            }
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
} 