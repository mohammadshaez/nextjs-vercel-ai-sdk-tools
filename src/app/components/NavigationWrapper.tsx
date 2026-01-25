"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isFeaturePage = pathname.startsWith("/ui/");

  if (isHomePage) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  if (isFeaturePage) {
    return (
      <>
        <Sidebar />
        <div className="lg:pl-64 transition-all duration-300">
          <div className="pt-16 lg:pt-0">
            {/* pt-16 for mobile header */}
            {children}
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
