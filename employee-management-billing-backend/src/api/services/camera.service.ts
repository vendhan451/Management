import prisma from '../../config';
import path from 'path';
import fs from 'fs';

export const uploadImage = async (file: any) => {
  // Save file to disk (or use cloud storage in production)
  const uploadDir = path.join(__dirname, '../../../public/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, file.originalname);
  fs.writeFileSync(filePath, file.buffer);
  const url = `/uploads/${file.originalname}`;
  // Save metadata to DB (assumes ImageUpload model exists)
  const image = await prisma.imageUpload.create({
    data: {
      url,
      fileName: file.originalname,
      fileType: file.mimetype,
      uploadedBy: file.userId || null
    }
  });
  return image;
};

export const getImages = async (query: any) => {
  // Filter by user if provided
  const where: any = {};
  if (query.userId) where.uploadedBy = query.userId;
  return prisma.imageUpload.findMany({ where, orderBy: { createdAt: 'desc' } });
};
