"use client"
import React,{ useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
function VideoUpload() {
  const[file,setFile]=useState<File|null>(null);
  const[title,setTitle]=useState<string>("");
  const[description,setDescription]=useState<string>("")
  const[error,setError]=useState<string>("")
const[isUploading,setIsUploading]=useState<boolean>(false)
const router=useRouter()
const MAX_SIZE=1000*1024*1024

const handleSubmit=async(e:React.FormEvent)=>{
  e.preventDefault()
if(!file){
return;
}
if(file.size>MAX_SIZE){
alert("File size too large");
return;
}
setIsUploading(true)
const formData=new FormData()
formData.append('file',file);
formData.append('title',title);
formData.append('description',description);
formData.append("originalSize",file.size.toString())
try{
const response=await axios.post('/api/video-upload',formData)
if(response.status!=200){
console.log("error is coming here")
throw new Error("error in uploading the video")
}
router.push('/')
}
catch(error:any){
console.log(error)
setError(error)
}
}
  return (
          <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Upload Video</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full text-slate-200"
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
                className="textarea textarea-bordered w-full text-slate-200"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  console.log(e.target)
                  setFile(e.target.files?.[0] || null)}}
                className="file-input text-slate-200 text-base font-medium file-input-bordered w-full"
                required
              />
            </div>
              {isUploading && (
                <div className="mt-4">
                  <progress className="progress progress-primary w-full"></progress>
                </div>
              )}


            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
            {error && <h1 className='text-red-700 text-sm'>Error in uploading video</h1>}
          </form>
        </div>
  )
}

export default VideoUpload