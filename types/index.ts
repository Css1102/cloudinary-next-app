export interface Video {
  id: string;
  title: string;
  description?: string;
  publicId: string;
  originalSize: number;
  compressedSize: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;         // ✅ foreign key
  user?: User;            // ✅ optional relation
}
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  clerkId: string;        // ✅ matches your Prisma schema
  videos?: Video[];       // ✅ optional relation
}