"use client";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  imageUrl?: string;
  className?: string;
}

const UserAvatar = React.forwardRef<HTMLSpanElement, Props>(
  ({ name, imageUrl, className = "w-9 h-9", ...props }, ref) => {
    const initials = name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return (
      <Avatar className={className} {...props} ref={ref}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="object-cover"
            width={36}
            height={36}
            quality={100}
          />
        ) : (
          <AvatarFallback className="primary-gradient font-jost font-bold tracking-wider text-white">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    );
  },
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
