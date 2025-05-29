import Container from "@/components/custom/Container";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
          {/* Image Column */}
          <div>
            <Skeleton className="h-128 rounded-lg" />
          </div>

          {/* Details Column */}
          <div className="flex flex-col gap-4 ">
            <Skeleton className="h-10 w-[80%] rounded-lg" />

            {/* Rating (no change) */}
            <Skeleton className="h-6 w-[20%] rounded-lg" />

            {/* Price Display */}
            <Skeleton className="h-8 w-[20%] rounded-lg" />

            {/* Description (no change) */}
            <Skeleton className="h-20 rounded-lg" />

            {/* Pass productItems to ProductVariants */}
            <Skeleton className="h-32 rounded-lg" />

            <Separator className="mt-6" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Loading;
