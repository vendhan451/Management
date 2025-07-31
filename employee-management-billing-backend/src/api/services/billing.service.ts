import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { createBillingRecordSchema, updateBillingRecordSchema, importBillingRecordsSchema } from '../validators/billing.validators';
import { AppError } from '../utils/errorHandler';
import fs from 'fs';
import Papa from 'papaparse';

const prisma = new PrismaClient();

type CreateBillingRecordInput = z.infer<typeof createBillingRecordSchema>;
type UpdateBillingRecordInput = z.infer<typeof updateBillingRecordSchema>;

export class BillingService {
  async createBillingRecord(data: CreateBillingRecordInput) {
    return await prisma.billingRecord.create({ data });
  }

  async getBillingRecords() {
    return await prisma.billingRecord.findMany();
  }

  async updateBillingRecord(id: string, data: UpdateBillingRecordInput) {
    return await prisma.billingRecord.update({
      where: { id },
      data,
    });
  }

  async deleteBillingRecord(id: string) {
    return await prisma.billingRecord.delete({
      where: { id },
    });
  }

  async importBillingRecordsFromCSV(filePath: string) {
    const csvFile = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(csvFile, { header: true, dynamicTyping: true });

    const validatedData = importBillingRecordsSchema.parse(parsed.data);

    const createdRecords = await prisma.$transaction(
      validatedData.map((record) => prisma.billingRecord.create({ data: record }))
    );

    return {
      message: 'Billing records imported successfully',
      count: createdRecords.length,
    };
  }
}
