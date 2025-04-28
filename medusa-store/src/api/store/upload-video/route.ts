// src/api/store/upload-video/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import multer from "multer"
import path from "path"
import fs from "fs"

// configure multer to write into /uploads
const upload = multer({
     dest: path.resolve(process.cwd(), "uploads"),
   })

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  // run multer
  await new Promise<void>((resolve, reject) => {
    upload.single("video")(req as any, res as any, (err: any) => {
      if (err) return reject(err)
      resolve()
    })
  })

  const file = (req as any).file
  if (!file) {
    res.status(400).json({ error: "No video file provided." })
    return
  }
   // Rename the file on disk to add the original extension
  const ext = path.extname(file.originalname)        // e.g. ".mp4"
  const oldPath = file.path                          // e.g. ".../uploads/549bf9…"
  const newName = file.filename + ext                // e.g. "549bf9….mp4"
  const newPath = path.resolve(process.cwd(), "uploads", newName)
  fs.renameSync(oldPath, newPath)

  // respond with the public URL and original name
    res.json({
        url: `/uploads/${newName}`,                     // include .mp4
        originalName: file.originalname,
      })
}
