import { PrismaClient } from "@prisma/client";
import { NextRequest,NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { compressVideo } from '@/lib/compressVideo';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}
type updatedData={
title:string,
description:string,
originalSize:string,
compressedSize:string,
duration:number,
publicId:string,
}
export async function GET(request: NextRequest, {params}:{params:{id:string}}) {
    const {id}=await params
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const video = await prisma.video.findUnique({
    where: { id: id },
    include: { user: true },
  });

  if (!video || video.user.clerkId !== clerkId) {
    return new Response(JSON.stringify({ error: "Video not found or unauthorized" }), { status: 404 });
  }

  return new Response(JSON.stringify(video), { status: 200 });
}

export async function PUT(request:NextRequest,{params}:{params:{id:string}}){
const {id}=await params
  const { userId: clerkId } = await auth();


  if (!clerkId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
    const video = await prisma.video.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!video || video.user.clerkId !== clerkId) {
    return new Response(JSON.stringify({ error: "Unauthorized or not found" }), { status: 404 });
  }
try{
    const existingVideo = await prisma.video.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingVideo || existingVideo.user.clerkId !== clerkId) {
      return NextResponse.json({ error: 'Video not found or unauthorized' }, { status: 404 });
    }
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const originalSize = formData.get("originalSize") as string;  
  

  let updatedData:Partial<updatedData>={
title,
description
  }
  if(file){
    const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const compressedBuffer = await compressVideo(buffer);

      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_chunked_stream(
          {
            resource_type: 'video',
            folder: 'video-uploads',
            eager: [
              {
                quality: '20',
                format: 'mp4',
                video_codec: 'h264',
                bit_rate: '500k',
                transformation: [
                  { fps: 24 },
                  { width: 720, crop: 'scale' },
                ],
              },
            ],
            eager_async: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(compressedBuffer);
      });
              console.log(result)
      updatedData = {
        ...updatedData,
         publicId: result.public_id,
        originalSize,
        compressedSize: String(result.bytes),
        duration: result.duration || 0,
      };

  }
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: updatedData,
    });

        return NextResponse.json(updatedVideo, { status: 200 });
}
    catch(err){
    return NextResponse.json({error:"error in updating the video",status:500});
}
finally{
await prisma.$disconnect
}

    }


