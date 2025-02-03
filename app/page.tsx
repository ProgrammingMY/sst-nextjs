"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter() ;
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">KelasTech</h1>
      <Button onClick={() => router.push("/login")}>Login</Button>
      <Button onClick={() => router.push("/signup")}>Signup</Button>
    </div>
  )
}
