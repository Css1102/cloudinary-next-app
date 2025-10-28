"use client";
export const dynamic = "force-dynamic";

import React, { useState, useCallback, useEffect } from "react";
import {useUserContext} from '@/app/Context/UserContext'
import axios from "axios";
import { Video } from "@/types";
import VideoCard from "@/app/components/VideoCard";
import { useUser } from "@clerk/nextjs";
import { SignInButton,SignUpButton } from "@clerk/nextjs";
import { Share2Icon,UploadIcon,ImageIcon } from "lucide-react";
function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, isLoaded } = useUser();
  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
   if(!isLoaded){
  return
   }
   if(!isSignedIn){
  setLoading(false)
  return;
   }
    const syncAndFetch = async () => {
      try {
        await fetch("/api/sync-user", { method: "POST" });
        await fetchVideos();
      } catch (err) {
        console.error("Sync or fetch failed:", err);
        setError("Failed to sync user or fetch videos");
        setLoading(false);
      }
      finally{
      setLoading(false)
      }
    };

    syncAndFetch();
  }, [isSignedIn, isLoaded, fetchVideos]);
  const handleDeleteSuccess = (id: string) => {
  setVideos((prev) => prev.filter((video) => video.id !== id));
};
  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (loading) {
    return (
      <div className="flex items-start w-full min-h-screen justify-center bg-gradient-to-b from-white to-gray-100">
        <h1>Loading...</h1>
      </div>
    );
  }
if (!isSignedIn && isLoaded) {
  return (
    <div className="flex flex-col lg:py-0 items-center justify-center w-full h-[100vh] bg-gradient-to-b from-white to-gray-100 px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 leading-tight tracking-tight">
        Showcase Your Videos <br className="hidden sm:block" /> with Style & Speed
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10">
        Upload, compress, and share your videos effortlessly. Built for creators who care about clarity, performance, and visual polish.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <UploadIcon className="mx-auto h-8 w-8 text-blue-500 mb-3" />
          <h3 className="text-gray-800 font-semibold text-lg mb-1">Fast Uploads</h3>
          <p className="text-gray-500 text-sm">Drag and drop your videos. We handle the rest.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <ImageIcon className="mx-auto h-8 w-8 text-green-500 mb-3" />
          <h3 className="text-gray-800 font-semibold text-lg mb-1">Smart Compression</h3>
          <p className="text-gray-500 text-sm">Save bandwidth without sacrificing quality.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
          <Share2Icon className="mx-auto h-8 w-8 text-purple-500 mb-3" />
          <h3 className="text-gray-800 font-semibold text-lg mb-1">Easy Sharing</h3>
          <p className="text-gray-500 text-sm">Share links or download with one click.</p>
        </div>
      </div>

      <p className="mt-12 text-gray-400 italic text-sm">
        “Your content deserves clarity, speed, and style.”
      </p>
    </div>
  );
}


  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold text-center mb-4">Videos</h1>
      {videos.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No videos available
        </div>
      ) : (
        <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-4">
          {videos.map((video) => (
            <VideoCard onDeleteSuccess={handleDeleteSuccess} key={video.id} video={video} onDownload={handleDownload} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
