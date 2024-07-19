import { authRouter } from "./router/auth";
import { projectRouter } from "./router/project";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    auth: authRouter,
    project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
