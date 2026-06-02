import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="mb-10 text-center text-4xl font-bold leading-tight tracking-tighter md:text-left md:text-5xl lg:text-6xl">
      {children}
    </h1>
  );
}
