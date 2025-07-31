import { z } from 'zod';

const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const createBillingRecordSchema = z.object({
  userId: z.string().uuid(),
  projectId: z.string().uuid(),
  clientName: z.string().min(1),
  hoursBilled: z.number().optional(),
  rateApplied: z.number().optional(),
  calculatedAmount: z.number(),
  date: dateSchema,
  notes: z.string().optional(),
  isCountBased: z.boolean(),
  achievedCountTotal: z.number().optional(),
  countMetricLabelUsed: z.string().optional(),
  formulaUsed: z.string().optional(),
  billingPeriodStartDate: dateSchema.optional(),
  billingPeriodEndDate: dateSchema.optional(),
});

export const updateBillingRecordSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  clientName: z.string().min(1).optional(),
  hoursBilled: z.number().optional(),
  rateApplied: z.number().optional(),
  calculatedAmount: z.number().optional(),
  date: dateSchema.optional(),
  notes: z.string().optional(),
  isCountBased: z.boolean().optional(),
  achievedCountTotal: z.number().optional(),
  countMetricLabelUsed: z.string().optional(),
  formulaUsed: z.string().optional(),
  billingPeriodStartDate: dateSchema.optional(),
  billingPeriodEndDate: dateSchema.optional(),
});

export const importBillingRecordsSchema = z.array(createBillingRecordSchema);
