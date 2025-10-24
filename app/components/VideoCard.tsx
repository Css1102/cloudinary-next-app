"use client"
import React,{useState,useEffect,useCallback,useRef} from 'react'
import { getCldImageUrl,getCldVideoUrl } from 'next-cloudinary'
import { useUserContext } from '../Context/UserContext'
import { Download,Clock,FileDown,FileUp } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {filesize} from 'filesize'
import {Video} from '@/types'
import { useRouter } from 'next/navigation'
import { MoreHorizontal } from 'lucide-react'
import axios from 'axios'
import { Blob } from 'node:buffer'
dayjs.extend(relativeTime)

interface VideoCardProps{
video:Video,
onDownload:(url:string,title:string)=>void
onDeleteSuccess: (id: string) => void;
}
const VideoCard: React.FC<VideoCardProps>=({video,onDownload,onDeleteSuccess}) => {
    const[isHovered,setIsHovered]=useState<boolean>(false)
    const[previewError,setPreviewError]=useState<boolean>(false)
    const[threedotClick,setThreedotclick]=useState<boolean>(false)
    const router=useRouter()
     const menuRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      event.target instanceof Node &&
      !menuRef.current.contains(event.target)
    ) {
      setThreedotclick(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);    
const handleDelete=async()=>{
try{
console.log("inside try block")
const response=await axios.delete('/api/delete-video',{data:{id:video.id}})
if(response.status===200){
console.log("video deleted")
onDeleteSuccess(response?.data?.video?.id)
}
}
catch(err){
    console.log("Error deleting video:", err);
}
}

const handleUpdate=()=>[
router.push(`edit/${video.id}`)
]
const handlesetThreedotclick=()=>{
    setThreedotclick((prev)=>!prev)
    }
    const getThumbnailUrl=useCallback((publicId:string)=>{
    return getCldImageUrl({
    src:publicId,
    width:400,
    height:225,
    crop:"fill",
    gravity:"auto",
    format:"jpg",
    quality:"auto",
    assetType:"video"
    })
    },[])

    const getFullVideoUrl = useCallback((publicId: string) => {
  return getCldVideoUrl({
    src: publicId,
    format: "mp4",
    quality: "auto",
    width: 1280, // optional
    height: 720, // optional
    rawTransformations: ["fl_attachment"]
  });
}, []);
      const getPreviewVideoUrl=useCallback((publicId:string)=>{
    return getCldVideoUrl({
    src:publicId,
    width:400,
    height:225,
    rawTransformations:['e_preview:duration_15:max_seg_9:min_seg_dur_1']
    })
    },[])
   const formatSize=useCallback((size:number)=>{
    return filesize(size)
   },[])

   const formatDuration=useCallback((seconds:number)=>{
   const minutes=Math.floor(seconds/60);
   const remainingSeconds=Math.round(seconds%60);
   return `${minutes}:${remainingSeconds.toString().padStart(2,"0")}`
   },[])

   const compressionPercentage=Math.round((1-
    Number(video.compressedSize)/Number(video.originalSize))*100)
   
   const handlePreviewError=()=>{
   setPreviewError(true)
   }
   useEffect(()=>{
   setPreviewError(false)
   },[isHovered])
  return (
     <div
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <figure className="aspect-video relative">
            {isHovered ? (
              previewError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p className="text-red-500">Preview not available</p>
                </div>
              ) : (
                <video
                  src={getPreviewVideoUrl(video.publicId)}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                  onError={handlePreviewError}
                />
              )
            ) : (
              <div className='relative'>
              <img
                src={getThumbnailUrl(video.publicId)}
                alt={video.title}
                className="w-full h-full object-cover"
              />
        </div>  )}
            <div className="absolute bottom-2 right-2 bg-base-100 text-slate-200 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
              <Clock size={16} className="mr-1" />
              {formatDuration(video.duration)}
            </div>
          </figure>
          <div className="card-body p-4">
            <div className=" flex items-center justify-between">
            <h2 className="card-title text-slate-200 text-lg font-bold">{video.title}</h2>
            </div>
            <p className="text-sm text-base-content opacity-70 mb-4">
              {video.description}
            </p>
            <p className="text-sm text-base-content opacity-70 mb-4">
              Uploaded {dayjs(video.createdAt).fromNow()}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <FileUp size={18} className="mr-2 text-primary" />
                <div>
                  <div className="font-semibold text-slate-200">Original</div>
                  <div className='text-slate-200'>{formatSize(Number(video.originalSize))}</div>
                </div>
              </div>
              <div className="flex items-center">
                <FileDown size={18} className="mr-2 text-secondary" />
                <div ref={menuRef} className='relative'>
                  <div className="font-semibold text-slate-200">Compressed</div>
                  <div className='text-slate-200'>{formatSize(Number(video.compressedSize))}</div>
                </div>
       </div>
                  <div ref={menuRef} className="relative ml-4">
        <div onClick={handlesetThreedotclick}>
          <MoreHorizontal className="text-white" />
        </div>
        {threedotClick && (
          <ul className="absolute top-0 right-0 w-32 rounded-lg shadow-lg bg-zinc-100 border border-slate-300 z-[100]">
            <li
              className="px-4 py-2 text-slate-700 hover:bg-yellow-500 hover:text-white cursor-pointer transition-colors"
              onClick={() =>handleUpdate()}
            >
              Update
            </li>
            <li
              className="px-4 py-2 text-slate-700 hover:bg-red-500 hover:text-white cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Delete clicked");
                handleDelete();
              }}
            >
              Delete
            </li>
          </ul>
        )}
    </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm font-semibold text-slate-200">
                Compression:{" "}
                <span className="text-accent">{compressionPercentage}%</span>
              </div>
<button
  className="btn btn-primary btn-sm"
  onClick={() => {
    const url = getFullVideoUrl(video.publicId);
fetch(url).then((response)=>response.blob()).then((blob)=>{
const url=window.URL.createObjectURL(blob);
const link=document.createElement('a');
link.href=url;
link.download=`${video.title}.mp4`;
document.body.appendChild(link)
link.click()
console.log("clicked!")
document.body.removeChild(link)
window.URL.revokeObjectURL(url)
})}}
>
  <Download size={16} />
</button>

            </div>
          </div>
        </div>
  )
}

export default VideoCard