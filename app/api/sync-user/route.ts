import type { NextApiRequest, NextApiResponse } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export  async function POST(
  req: NextApiRequest,
  res: NextApiResponse<{ success?: boolean; error?: string }>
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
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

    return NextResponse.json({status:200});
  } catch (err) {
    console.error("Failed to sync Clerk user:", err);
    return NextResponse.json({status:500,error:"could not verify the user"})
  }
}
