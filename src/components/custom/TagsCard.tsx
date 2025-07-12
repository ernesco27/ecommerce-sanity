import React from "react";
import { Badge } from "../ui/badge";

import { useRouter } from "next/navigation";

const TagsCard = ({ tag }: { tag: string }) => {
  const router = useRouter();

  const handleTag = (tag: string) => {
    router.push(`/products?tag=${tag}`);
  };

  return (
    <>
      <Badge
        className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase flex flex-row gap-2 cursor-pointer "
        onClick={() => handleTag(tag)}
      >
        {tag}
      </Badge>
    </>
  );
};

export default TagsCard;
