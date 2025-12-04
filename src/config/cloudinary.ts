import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'finalease/submissions',
    allowed_formats: ['pdf'],
    resource_type: 'raw', // For non-image files like PDF
    public_id: (req: any, file: any) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\.[^/.]+$/, ''); // Remove extension
      return `${timestamp}-${originalName}`;
    }
  } as any
});

export const uploadToCloudinary = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Helper to delete file from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

// Extract public_id from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    // URL format: https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/{folder}/{public_id}.pdf
    const matches = url.match(/\/finalease\/submissions\/([^.]+)/);
    return matches ? `finalease/submissions/${matches[1]}` : null;
  } catch (error) {
    return null;
  }
};

export { cloudinary };
