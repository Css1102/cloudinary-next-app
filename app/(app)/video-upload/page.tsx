"use client"
import React,{use, useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
function VideoUpload() {
  const[file,setFile]=useState<File|null>(null);
  const[title,setTitle]=useState<string>("");
  const[description,setDescription]=useState<string>("")
  const[error,setError]=useState<string>("")
const[isUploading,setIsUploading]=useState<boolean>(false)
const router=useRouter()
const MAX_SIZE=70*1024*1024

const handleSubmit=async(e:React.FormEvent)=>{
if(!file){
return;
}
if(file.size>MAX_SIZE){
alert("File size too large");
return;
}
setIsUploading(true)
const formdata=new FormData()
formdata.append('file',file);
formdata.append('title',title);
formdata.append('description',description);
formdata.append("orignalSize",file.size.toString())
try{
const response=await axios.post('/api/video-upload',formdata)
if(response.status!=200){
throw new Error("error in uploading the video")
}
}
catch(error:any){
console.log(error)
setError(error)
}
}
  return (
          <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
  )
}

export default VideoUpload