# 📁 **FILE UPLOAD & STORAGE - COMPLETE IMPLEMENTATION**

## 📋 **PART 8: FILE MANAGEMENT & CLOUD STORAGE**

---

## 🔧 **STORAGE CONFIGURATION**

### **Option 1: Cloudinary (Recommended)**

```bash
# Install Cloudinary
npm install cloudinary multer

# Environment Variables
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Option 2: Supabase Storage**

```bash
# Already installed with @supabase/supabase-js

# Environment Variables
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=retail-bandhu-files
```

---

## 📦 **STORAGE SERVICE**

### **`src/services/storage.service.ts`**

```typescript
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'retail-bandhu'
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    logger.info('File uploaded to Cloudinary', {
      url: result.secure_url,
      publicId: result.public_id,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (error: any) {
    logger.error('Cloudinary upload failed', { error: error.message });
    
    // Clean up local file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info('File deleted from Cloudinary', { publicId });
  } catch (error: any) {
    logger.error('Cloudinary delete failed', { error: error.message });
    throw error;
  }
};

/**
 * Upload file to Supabase Storage
 */
export const uploadToSupabase = async (
  filePath: string,
  fileName: string,
  bucket: string = 'retail-bandhu-files'
): Promise<any> => {
  try {
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: getContentType(fileName),
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    // Delete local file after upload
    fs.unlinkSync(filePath);

    logger.info('File uploaded to Supabase', { url: urlData.publicUrl });

    return {
      url: urlData.publicUrl,
      path: data.path,
      bucket,
    };
  } catch (error: any) {
    logger.error('Supabase upload failed', { error: error.message });
    
    // Clean up local file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    throw error;
  }
};

/**
 * Delete file from Supabase Storage
 */
export const deleteFromSupabase = async (
  fileName: string,
  bucket: string = 'retail-bandhu-files'
): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) {
      throw error;
    }

    logger.info('File deleted from Supabase', { fileName });
  } catch (error: any) {
    logger.error('Supabase delete failed', { error: error.message });
    throw error;
  }
};

/**
 * Upload product image
 */
export const uploadProductImage = async (
  filePath: string,
  productId: string,
  userId: string
): Promise<string> => {
  const folder = `products/${userId}`;
  const fileName = `product-${productId}-${Date.now()}${path.extname(filePath)}`;

  // Use Cloudinary by default (can switch based on env variable)
  const useCloudinary = process.env.STORAGE_PROVIDER !== 'supabase';

  if (useCloudinary) {
    const result = await uploadToCloudinary(filePath, folder);
    return result.url;
  } else {
    const result = await uploadToSupabase(filePath, `${folder}/${fileName}`);
    return result.url;
  }
};

/**
 * Upload invoice PDF
 */
export const uploadInvoicePDF = async (
  filePath: string,
  invoiceNumber: string,
  userId: string
): Promise<string> => {
  const folder = `invoices/${userId}`;
  const fileName = `invoice-${invoiceNumber}-${Date.now()}.pdf`;

  const useCloudinary = process.env.STORAGE_PROVIDER !== 'supabase';

  if (useCloudinary) {
    const result = await uploadToCloudinary(filePath, folder);
    return result.url;
  } else {
    const result = await uploadToSupabase(filePath, `${folder}/${fileName}`);
    return result.url;
  }
};

/**
 * Get content type from file extension
 */
function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Validate file type
 */
export const validateFileType = (
  fileName: string,
  allowedTypes: string[]
): boolean => {
  const ext = path.extname(fileName).toLowerCase();
  return allowedTypes.includes(ext);
};

/**
 * Validate file size
 */
export const validateFileSize = (
  fileSize: number,
  maxSizeMB: number
): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
};
```

---

## 📤 **MULTER CONFIGURATION**

### **`src/config/multer.ts`**

```typescript
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Multiple file upload configurations
export const uploadProductImage = upload.single('image');
export const uploadMultipleImages = upload.array('images', 10);
export const uploadInvoicePDF = upload.single('pdf');
```

---

## 🛣️ **UPLOAD ROUTES**

### **`src/routes/upload.routes.ts`**

```typescript
import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.js';
import {
  uploadProductImage,
  uploadMultipleImages,
  uploadInvoicePDF,
} from '../config/multer.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/upload/product-image
 * @desc    Upload product image
 * @access  Private
 */
router.post(
  '/product-image',
  uploadProductImage,
  uploadController.uploadProductImage
);

/**
 * @route   POST /api/v1/upload/multiple-images
 * @desc    Upload multiple images
 * @access  Private
 */
router.post(
  '/multiple-images',
  uploadMultipleImages,
  uploadController.uploadMultipleImages
);

/**
 * @route   POST /api/v1/upload/invoice-pdf
 * @desc    Upload invoice PDF
 * @access  Private
 */
router.post(
  '/invoice-pdf',
  uploadInvoicePDF,
  uploadController.uploadInvoicePDF
);

/**
 * @route   DELETE /api/v1/upload/delete
 * @desc    Delete uploaded file
 * @access  Private
 */
router.delete('/delete', uploadController.deleteFile);

export default router;
```

---

## 🎮 **UPLOAD CONTROLLER**

### **`src/controllers/upload.controller.ts`**

```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import * as storageService from '../services/storage.service.js';

/**
 * @desc    Upload product image
 * @route   POST /api/v1/upload/product-image
 * @access  Private
 */
export const uploadProductImage = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!req.file) {
      return errorResponse(res, { message: 'No file uploaded' }, 400);
    }

    // Validate file type
    const isValidType = storageService.validateFileType(req.file.originalname, [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
    ]);

    if (!isValidType) {
      return errorResponse(
        res,
        { message: 'Invalid file type. Only images are allowed.' },
        400
      );
    }

    // Validate file size (5MB)
    const isValidSize = storageService.validateFileSize(req.file.size, 5);

    if (!isValidSize) {
      return errorResponse(
        res,
        { message: 'File size too large. Maximum 5MB allowed.' },
        400
      );
    }

    // Upload to cloud storage
    const imageUrl = await storageService.uploadProductImage(
      req.file.path,
      productId,
      userId!
    );

    return successResponse(
      res,
      {
        message: 'Image uploaded successfully',
        data: {
          url: imageUrl,
          fileName: req.file.originalname,
        },
      },
      201
    );
  }
);

/**
 * @desc    Upload multiple images
 * @route   POST /api/v1/upload/multiple-images
 * @access  Private
 */
export const uploadMultipleImages = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return errorResponse(res, { message: 'No files uploaded' }, 400);
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      // Validate each file
      const isValidType = storageService.validateFileType(file.originalname, [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
      ]);
      const isValidSize = storageService.validateFileSize(file.size, 5);

      if (!isValidType || !isValidSize) {
        continue; // Skip invalid files
      }

      // Upload to cloud storage
      const productId = `temp-${Date.now()}`;
      const imageUrl = await storageService.uploadProductImage(
        file.path,
        productId,
        userId!
      );

      uploadedUrls.push({
        url: imageUrl,
        fileName: file.originalname,
      });
    }

    return successResponse(
      res,
      {
        message: `${uploadedUrls.length} images uploaded successfully`,
        data: uploadedUrls,
      },
      201
    );
  }
);

/**
 * @desc    Upload invoice PDF
 * @route   POST /api/v1/upload/invoice-pdf
 * @access  Private
 */
export const uploadInvoicePDF = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { invoiceNumber } = req.body;

    if (!req.file) {
      return errorResponse(res, { message: 'No file uploaded' }, 400);
    }

    // Validate file type
    const isValidType = storageService.validateFileType(req.file.originalname, [
      '.pdf',
    ]);

    if (!isValidType) {
      return errorResponse(
        res,
        { message: 'Invalid file type. Only PDFs are allowed.' },
        400
      );
    }

    // Validate file size (10MB for PDFs)
    const isValidSize = storageService.validateFileSize(req.file.size, 10);

    if (!isValidSize) {
      return errorResponse(
        res,
        { message: 'File size too large. Maximum 10MB allowed.' },
        400
      );
    }

    // Upload to cloud storage
    const pdfUrl = await storageService.uploadInvoicePDF(
      req.file.path,
      invoiceNumber,
      userId!
    );

    return successResponse(
      res,
      {
        message: 'PDF uploaded successfully',
        data: {
          url: pdfUrl,
          fileName: req.file.originalname,
        },
      },
      201
    );
  }
);

/**
 * @desc    Delete file
 * @route   DELETE /api/v1/upload/delete
 * @access  Private
 */
export const deleteFile = asyncHandler(
  async (req: Request, res: Response) => {
    const { publicId, provider = 'cloudinary' } = req.body;

    if (!publicId) {
      return errorResponse(
        res,
        { message: 'Public ID or file path required' },
        400
      );
    }

    if (provider === 'cloudinary') {
      await storageService.deleteFromCloudinary(publicId);
    } else if (provider === 'supabase') {
      await storageService.deleteFromSupabase(publicId);
    } else {
      return errorResponse(res, { message: 'Invalid storage provider' }, 400);
    }

    return successResponse(res, {
      message: 'File deleted successfully',
      data: null,
    });
  }
);
```

---

## 🎯 **FILE UPLOAD FEATURES**

### **✅ Image Uploads:**
- Product images
- Multiple image uploads
- Image validation (type & size)
- Automatic cloud upload
- Local file cleanup

### **✅ Document Uploads:**
- Invoice PDFs
- Receipt uploads
- File type validation
- Size limit enforcement

### **✅ Storage Options:**
- Cloudinary integration
- Supabase Storage integration
- Configurable provider
- Automatic cleanup

### **✅ Security:**
- File type validation
- File size limits
- Authentication required
- User-specific folders

### **✅ Features:**
- Single file upload
- Multiple file upload
- File deletion
- URL generation
- Error handling

---

## 📝 **USAGE EXAMPLE - FRONTEND**

```typescript
// Upload product image
const uploadProductImage = async (file: File, productId: string) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('productId', productId);

  const response = await fetch('/api/v1/upload/product-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.data.url;
};

// Upload invoice PDF
const uploadInvoicePDF = async (file: File, invoiceNumber: string) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('invoiceNumber', invoiceNumber);

  const response = await fetch('/api/v1/upload/invoice-pdf', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.data.url;
};
```

---

**Next: API Documentation & Deployment →**
