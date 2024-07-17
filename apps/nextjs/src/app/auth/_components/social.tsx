import { Youtube } from "lucide-react";

import { Button } from "@acme/ui/button";

import { signInWithGoogle } from "~/app/auth/actions";

export const Social = () => {
  return (
    <form className="flex w-full flex-col items-center gap-2">
      <Button
        size="lg"
        className="flex w-full flex-row items-center justify-center gap-2"
        variant="outline"
        formAction={signInWithGoogle}
      >
        <Youtube size={20} />
        <span className="font-medium text-muted-foreground">
          Continue with Google
        </span>
      </Button>
    </form>
  );
};
