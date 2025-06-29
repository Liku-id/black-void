"use client";
import Image from "next/image";
import logo from "@/assets/logo/logo.svg";

export default function Header() {
  return (
    <header className="fixed top-3 left-0 right-0 z-50">
      <div className="w-[98%] left-1/2 transform -translate-x-1/2 relative">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <Image
              src={logo}
              alt="Logo"
              width={120}
              height={40}
              className="h-8 w-auto brightness-0 invert"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
} 