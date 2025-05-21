import React from "react";

const HeadingSidebar = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <h6 className="capitalize font-normal ">{name}</h6>
      </div>
    </div>
  );
};

export default HeadingSidebar;
