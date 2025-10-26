import type { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export  async function POST(
  req: NextRequest,
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return Response.json({status:401,error:"Unauthorized"})
  }

  try {
const clerkUserRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
  headers: {
    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
  },
});
const clerkUser = await clerkUserRes.json();

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
      },
    });

    return Response.json({status:200});
  } catch (err) {
    console.error("Failed to sync Clerk user:", err);
    return Response.json({status:500,error:"could not verify the user"})
  }
}
