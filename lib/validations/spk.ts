import { z } from 'zod'

export const spkFormSchema = z.object({
    vendorName: z.string().min(1, 'Vendor name is required'),
    vendorEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
    vendorPhone: z.string().optional(),
    projectName: z.string().min(1, 'Project name is required'),
    projectDescription: z.string().optional(),
    contractValue: z.number().min(1, 'Contract value must be greater than 0'),
    currency: z.string().default('IDR'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    dpPercentage: z.number().min(0).max(100),
    progressPercentage: z.number().min(0).max(100),
    finalPercentage: z.number().min(0).max(100),
    notes: z.string().optional(),
}).refine(
    (data) => {
        const total = data.dpPercentage + data.progressPercentage + data.finalPercentage
        return Math.abs(total - 100) < 0.01 // Allow for floating point errors
    },
    {
        message: 'Payment percentages must sum to 100%',
        path: ['dpPercentage'],
    }
)

export const paymentUpdateSchema = z.object({
    status: z.enum(['pending', 'paid', 'overdue']),
    paidDate: z.string().optional(),
    paymentReference: z.string().optional(),
})

export type SPKFormData = z.infer<typeof spkFormSchema>
export type PaymentUpdateData = z.infer<typeof paymentUpdateSchema>
