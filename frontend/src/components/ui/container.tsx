import type { HTMLAttributes } from "react";

import { classNames } from "@/lib/styles/class-names";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classNames("mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
