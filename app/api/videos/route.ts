import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    console.log(clerkId)
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const videos = await prisma.video.findMany({
      where: { userId: user.id }, // ✅ filter by user
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: "Error fetching the videos" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}