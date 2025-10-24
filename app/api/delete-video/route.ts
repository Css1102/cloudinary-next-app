import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
   console.log(id)
   console.log(typeof(id))
  if (!id) {
    return new Response(JSON.stringify({ status: 405, error: "Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const deletedVideo = await prisma.video.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: "Video deleted successfully", video: deletedVideo }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete video", details: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
