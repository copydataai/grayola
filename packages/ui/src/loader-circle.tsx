import { LoaderCircle } from "lucide-react";

import { cn } from "@acme/ui";

export function LoaderCircleLucide({ className }) {
  return <LoaderCircle className={cn("animate-spin", className)} />;
}
