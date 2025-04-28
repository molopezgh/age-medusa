// src/api/middlewares.ts

import { defineMiddlewares } from "@medusajs/framework/http"
import express from "express"
import path from "path"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/uploads/*",
      // apply to all HTTP methods
      middlewares: [
        // serve from the actual uploads folder at the project root
        express.static(path.resolve(process.cwd(), "uploads")),
      ],
    },
  ],
})
