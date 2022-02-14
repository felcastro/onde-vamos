import React, { LinkHTMLAttributes } from "react";
import { FaStoreAlt, FaCog } from "react-icons/fa";

interface NavigationIconButtonProps
  extends LinkHTMLAttributes<HTMLAnchorElement> {
  icon: JSX.Element;
}

function NavigationIconButton({ icon, ...props }: NavigationIconButtonProps) {
  return (
    <a className="text-4xl" {...props}>
      {icon}
    </a>
  );
}

export default function Navigation() {
  return (
    <div className="absolute bottom-0 flex h-16 w-full">
      <div className="relative flex flex-1 bg-gray-900 bg-opacity-75 text-gray-50 shadow-md">
        <div className="flex flex-1 justify-evenly items-center gap-4 px-4 py-2">
          <NavigationIconButton href="/" icon={<FaStoreAlt />} />
          <NavigationIconButton href="/" icon={<FaCog />} />
        </div>
      </div>
    </div>
  );
}
