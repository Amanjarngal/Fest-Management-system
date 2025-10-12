import Image from "../models/Image.js";
import { promisify } from "util";
import cloudinary from "../config/cloudinary.js";

// Create Image (upload or URL)
export const createImage = async (req, res) => {
  try {
    const { title, description, tags, image } = req.body;
    let imageUrl = image || null;
    let public_id = null;

    // ✅ If a file is uploaded from computer → send to Cloudinary
    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "fest-images" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(fileBuffer);
        });
      };

      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
      public_id = result.public_id;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newImage = await Image.create({
      title,
      description,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      imageUrl,
      public_id,
    });

    res.status(201).json({ message: "Image uploaded successfully", newImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update Image (file upload or URL)
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, image } = req.body;
    const img = await Image.findById(id);

    if (!img) return res.status(404).json({ message: "Image not found" });

    // If a new file is uploaded
    if (req.file) {
      // Delete old Cloudinary image if exists
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      // Upload new image to Cloudinary using buffer
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "fest-images" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      img.imageUrl = result.secure_url;
      img.public_id = result.public_id;
    } else if (image) {
      // If a direct URL is provided
      img.imageUrl = image;
      img.public_id = null;
    }

    img.title = title || img.title;
    img.description = description || img.description;
    img.tags = tags ? tags.split(",").map(tag => tag.trim()) : img.tags;

    await img.save();

    res.json({ message: "Image updated successfully", img });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const img = await Image.findById(id);

    if (!img) return res.status(404).json({ message: "Image not found" });

    // Delete from Cloudinary if exists
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await img.deleteOne();
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Fetch all images
export const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};