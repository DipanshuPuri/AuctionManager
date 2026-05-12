const { supabase } = require('../config/supabase');
const path = require('path');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Storage Service – Avalon (AuctionManager)
// ---------------------------------------------------------------------------
// Handles file upload/deletion to Supabase Storage bucket "auction-images".
// ---------------------------------------------------------------------------

const BUCKET = 'auction-images';

/**
 * Upload an image buffer to Supabase Storage.
 * @param {Buffer} fileBuffer – raw file data from multer
 * @param {string} originalName – original filename for extension detection
 * @returns {Promise<string>} – public URL of the uploaded image
 */
const uploadImage = async (fileBuffer, originalName) => {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  // Generate a unique filename to avoid collisions
  const ext = path.extname(originalName) || '.jpg';
  const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
  const filePath = `auctions/${uniqueName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: `image/${ext.replace('.', '')}`,
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

/**
 * Delete an image from Supabase Storage.
 * @param {string} imageUrl – full public URL; we extract the path from it
 * @returns {Promise<void>}
 */
const deleteImage = async (imageUrl) => {
  if (!supabase || !imageUrl) return;

  try {
    // Extract the file path from the public URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${BUCKET}/`);
    const filePath = pathParts[1];

    if (filePath) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
      }
    }
  } catch (err) {
    console.error('Delete image error:', err.message);
  }
};

module.exports = { uploadImage, deleteImage };
