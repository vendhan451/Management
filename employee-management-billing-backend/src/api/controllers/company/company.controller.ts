import { Request, Response } from 'express';
import * as companyService from '../../services/company.service';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const getCompanyDetails = async (req: Request, res: Response) => {
  try {
    const company = await companyService.getCompany();
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
};

export const updateCompanyDetails = async (req: Request, res: Response) => {
  try {
    const company = await companyService.updateCompany(req.body);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update company details' });
  }
};


// Set up Cloudinary storage for company logos
const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'company_logos',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const logoUpload = multer({ storage: logoStorage }).single('logo');

export const uploadLogo = (req: Request, res: Response) => {
  logoUpload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: 'Logo upload failed' });
    }
    // @ts-ignore
    const logoUrl = req.file?.path;
    if (!logoUrl) {
      return res.status(400).json({ error: 'No logo file uploaded' });
    }
    // Update company with new logoUrl
    try {
      const company = await companyService.getCompany();
      if (!company) return res.status(404).json({ error: 'Company not found' });
      await companyService.updateCompany({ ...company, logoUrl });
      res.json({ logoUrl });
    } catch {
      res.status(500).json({ error: 'Failed to update company logo' });
    }
  });
};
