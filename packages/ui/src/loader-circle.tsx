import { LoaderCircle } from "lucide-react";

import { cn } from "@acme/ui";

type LoaderCircleLucideProps = {
  className?: string;
};
export const LoaderCircleLucide = ({ className }: LoaderCircleLucideProps) => {
  return <LoaderCircle className={cn("animate-spin", className)} />;
};
