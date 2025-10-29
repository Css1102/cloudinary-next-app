"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserProvider } from "../Context/UserContext";
import {
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
} from "lucide-react";
import loadDynamic from "next/dynamic";

const NavbarClient = loadDynamic(() => import("../components/NavbarClient"), { ssr: false });

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/home");
  };

  const handleSidebarClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
      <div className="drawer lg:drawer-open">
        <div className="drawer-content">
          {/* Navbar */}
          <header className="w-full border-b-[1px] border-solid bg-gradient-to-b from-slate-900 to-slate-800 border-[#000000]">
            <div className="navbar flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8">
              <div onClick={handleSidebarClick} className="flex-none">
                <label
                  htmlFor="sidebar-drawer"
                  className="btn btn-square btn-ghost drawer-button"
                >
                  <MenuIcon />
                </label>
              </div>
              <div className="flex-1">
                <Link href="/" onClick={handleLogoClick}>
                  <div className="btn btn-ghost ml-0 text-slate-200 normal-case font-bold text-2xl my-2 tracking-tight cursor-pointer">
                    Cloudinary Compressor
                  </div>
                </Link>
              </div>
              <NavbarClient />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-grow min-h-screen bg-gradient-to-b from-white to-gray-100 p-0">
            <div onClick={() => setSidebarOpen(false)} className="mx-auto w-full">
              {children}
            </div>
          </main>
        </div>

        {sidebarOpen && (
          <div>
            <aside className="bg-gradient-to-b from-slate-900 border-r-[1px] border-solid border-[#000000] to-slate-800 w-64 h-full flex flex-col">
              <div className="flex items-center justify-center py-4">
                <ImageIcon className="w-10 h-10 text-primary" />
              </div>
              <ul className="menu p-4 w-full text-base-content flex-grow">
                {sidebarItems.map((item) => (
                  <li key={item.href} className="mb-2">
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
                        pathname === item.href
                          ? "bg-primary text-white"
                          : "hover:bg-base-300"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-6 h-6" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </div>
  );
}
