export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import loadDynamic from "next/dynamic";

// Dynamically import your client component
const HomeClient = loadDynamic(() => import("./client-page"), { ssr: false });

export default function HomePage() {
  return <HomeClient />;
}
