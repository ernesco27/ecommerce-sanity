"use client";

import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div className="h-screen relative">
      <div className="absolute top-10 left-10 flex items-center gap-4 group">
        <Button
          onClick={() => router.back()}
          variant="nostyle"
          className="text-xl group-hover:text-yellow-900 gap-8"
        >
          <MoveLeft
            size={4}
            className=" group-hover:text-yellow-900 duration-100 ease-linear group-hover:translate-x-4 "
          />
          Go Back
        </Button>
      </div>
      {children}
    </div>
  );
};

export default layout;
