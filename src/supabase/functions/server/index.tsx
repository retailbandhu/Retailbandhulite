import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { adminRouter } from "./admin-api.tsx";
import { appRouter } from "./app-api.tsx";
import { authRouter } from "./auth-api.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c4099df5/health", (c) => {
  return c.json({ status: "ok" });
});

// Mount authentication routes
app.route("/make-server-c4099df5/auth", authRouter);

// Mount admin routes
app.route("/make-server-c4099df5/admin", adminRouter);

// Mount app data routes
app.route("/make-server-c4099df5/app", appRouter);

Deno.serve(app.fetch);