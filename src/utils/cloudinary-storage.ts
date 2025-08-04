// src/utils/cloudinary-storage.ts
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'profiles',
      format: 'jpeg', // or dynamically based on file mimetype
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    };
  },
});
