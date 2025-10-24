"use client"
import React,{ useState,useEffect} from 'react'
import axios from 'axios'
import { useRouter,useParams } from 'next/navigation'
import { getCldVideoUrl } from 'next-cloudinary'
function VideoUpload() {
const[newfile,setNewFile]=useState<File|null>(null);
const [file, setFile] = useState<any>(null);
const[title,setTitle]=useState<string>("");
const[description,setDescription]=useState<string>("")
const[error,setError]=useState<string>("")
const[isEditing,setIsEditing]=useState<boolean>(false)
const[loading, setLoading] = useState(true);
const router=useRouter()
const {id}=useParams()

const getEditedDetails=async()=>{
try{
const response=await axios.get(`/api/videos-edit/${id}`)
if(response.status===200){
console.log(response)
setFile(response.data)
setTitle(response.data.title)
setDescription(response.data.description)
}
}
catch(err:any){
console.log("error in geting the video",err)
}
finally{
setLoading(false)
}
}

useEffect(()=>{
if(!id){
return
}
getEditedDetails()}
,[id])
const handleEdit=async(e:React.FormEvent)=>{
e.preventDefault()
setIsEditing(true)
setError("")
try{
const formData=new FormData()
if(newfile){
formData.append("title",title);
formData.append("description",description);
formData.append("originalSize", newfile?.size.toString() || file?.originalSize || "0");
formData.append("file", newfile);
}
await axios.put(`/api/videos-edit/${id}`,formData)
router.push('/home')
}
catch(err:any){
console.log("error in updating video",err)
setError("error in updating video")
}
finally{
setIsEditing(false)
}
}
  return (
          <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Upload Video</h1>
          <form onSubmit={handleEdit} className="space-y-4">
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
    {file?.publicId && (
  <video
    src={getCldVideoUrl({ src: file.publicId, format: "mp4", quality: "auto" })}
    controls
    className="w-1/4 h-[200px] rounded-lg mb-4"
  />
)}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                className="file-input text-slate-200 text-base font-medium file-input-bordered w-full"
                required
              />
            </div>
              {isEditing && (
                <div className="mt-4">
                  <progress className="progress progress-info w-full"></progress>
                </div>
              )}


            <button
              type="submit"
              className="btn btn-info"
              disabled={isEditing}
            >
              {isEditing ? "Updating..." : "Update video"}
            </button>
            {error && <h1 className='text-red-700 text-sm'>Error in updating video</h1>}
          </form>
        </div>
  )
}

export default VideoUpload