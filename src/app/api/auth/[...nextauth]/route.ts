import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple test authentication endpoint
export async function POST(request: NextRequest) {
    const { email, role } = await request.json();

    // Create or update user
    const user = await prisma.user.upsert({
        where: { email },
        update: { role: role as any },
        create: {
            id: email, // Use email as ID for simplicity
            email,
            name: email.split('@')[0], // Use email prefix as name
            role: role as any,
        },
    });

    return NextResponse.json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
} 