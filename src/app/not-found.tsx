"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <p className=" text-[120px] lg:text-[200px] font-bold primary-text-image">
          404
        </p>
        <p className=" text-2xl lg:text-4xl mb-4">Oops! Page not Found</p>
        <p className=" text-[11px] lg:text-md mb-6">
          The page you're looking for cannot be found.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="primary-gradient w-[150px] h-[50px] cursor-pointer hover:border-2 hover:border-primary-900 transiton-all duration-300 ease-in-out text-dark300_light900"
        >
          Go to Home page
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
