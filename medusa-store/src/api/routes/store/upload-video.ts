import { Router } from "express";
import multer from "multer";
import { authenticate } from "@medusajs/medusa";

const router = Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage, adjust later for production (AWS or Cloudinary)

export default (app) => {
  app.use("/store/upload-video", router);

  router.post("/", authenticate("admin", ["bearer", "session"]), upload.single("video"), async (req, res) => {

    try {
      const videoFile = req.file;

      if (!videoFile) {
        return res.status(400).json({ error: "No video file provided." });
      }

      // Here, you'd ideally upload this file to a cloud provider (AWS S3, Cloudinary)
      // and then store the resulting URL in Medusa.

      // For now, just return a dummy response
      return res.status(200).json({
        url: `/uploads/${videoFile.filename}`,
        originalName: videoFile.originalname,
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};
