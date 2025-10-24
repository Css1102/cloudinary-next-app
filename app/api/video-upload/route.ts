import { NextRequest,NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import {auth} from '@clerk/nextjs/server'
import { PrismaClient } from "@prisma/client"
import {compressVideo} from "@/lib/compressVideo"
const prisma=new PrismaClient()

cloudinary.config({ 
        cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    });

    interface CloudinaryUploadResult{
    public_id:string,
    bytes:number,
    duration?:number,
    [key:string]:any
    }

    export async function POST(request:NextRequest){
    try{
    const {userId}=await auth()
    if(!userId){
    return NextResponse.json({error:'Unauthorized'},{status:401})
    }
    const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    });

    if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME|| !process.env.CLOUDINARY_API_KEY|| !process.env.CLOUDINARY_API_SECRET){
    return NextResponse.json({error:'cloudinary credentials not found'},{status:500})
    }

    const formData=await request.formData()
    console.log(formData)
    const file=formData.get("file") as File|null
    const title=formData.get("title") as string
    const description=formData.get("description") as string
    const originalSize=formData.get("originalSize") as string
    if(!file){
    return NextResponse.json({error:'No such file exists'},{status:400})
    }
    const bytes=await file.arrayBuffer()
    const buffer=Buffer.from(bytes)
    const compressedBuffer = await compressVideo(buffer);
    const result=await new Promise<CloudinaryUploadResult>((resolve,reject)=>{
    const uploadStream=cloudinary.uploader.upload_chunked_stream(
    {
    resource_type:'video',
    folder:'video-uploads',
    eager:[
    {quality:'20',
    format:'mp4',
    video_codec: "h264",
    bit_rate: "500k",
    transformation: [
      { fps: 24 },           
      { width: 720, crop: "scale" }
    ]
    }
    ],
    eager_async:true,
},
    (error,result)=>{
    if(error){
    reject(error)
    }
    else{
     resolve(result as CloudinaryUploadResult)
    }
    }

)
uploadStream.end(compressedBuffer)
})
console.log(result)
const video=await prisma.video.create({
data: {
title,
description,
publicId:result.public_id,
originalSize:originalSize,
compressedSize:String(result.bytes),
duration:result.duration || 0,
userId:user?.id
}
})
return NextResponse.json(video)
    }
    catch(error){
    console.log(error)
    return NextResponse.json({error:'Video upload failed'},{status:500})
    }
    finally{
    await prisma.$disconnect()
    }
    }
