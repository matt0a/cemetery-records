import { z } from 'zod'

export const LoginSchema = z.object({
    email: z.email({ message: 'Enter a valid email' }),
    password: z.string().min(6, { message: 'Min 6 characters' }),
})
export type LoginValues = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
    fullName: z.string().min(2, { message: 'Enter full name' }),
    email: z.email({ message: 'Enter a valid email' }),
    password: z.string().min(8, { message: 'Min 8 characters' }),
})
export type RegisterValues = z.infer<typeof RegisterSchema>

// RHF helper: empty/NaN -> undefined for optional number
const toOptionalNumber = (v: unknown) =>
    typeof v === 'number' && !Number.isNaN(v) ? v : undefined

export const BurialBundleSchema = z.object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    dateOfBirth: z.string().optional().or(z.literal('')),
    dateOfDeath: z.string().optional().or(z.literal('')),
    burialDate: z.string().min(1, { message: 'Required' }),
    gravePlotId: z.preprocess(toOptionalNumber, z.number().int().positive().optional()),
    section: z.string().optional().or(z.literal('')),
    plotNumber: z.string().optional().or(z.literal('')),
    locationDescription: z.string().optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
}).refine((v) => {
    const hasId = typeof v.gravePlotId === 'number'
    const hasSectionPair = !!v.section && !!v.plotNumber
    return hasId || hasSectionPair
}, { message: 'Provide an existing Grave Plot ID or a Section + Plot Number' })
export type BurialBundleValues = z.infer<typeof BurialBundleSchema>

// ✅ NEW: strict public search schema
export const StrictSearchSchema = z.object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    dateOfBirth: z.string().min(1, { message: 'Required' }), // HTML date input returns YYYY-MM-DD
})
export type StrictSearchValues = z.infer<typeof StrictSearchSchema>

// Admin: person edit
export const AdminPersonSchema = z.object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    dateOfBirth: z.string().optional().or(z.literal('')),
    dateOfDeath: z.string().optional().or(z.literal('')),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
})
export type AdminPersonValues = z.infer<typeof AdminPersonSchema>

// Admin: plot edit
export const AdminPlotSchema = z.object({
    section: z.string().min(1, { message: 'Required' }),
    plotNumber: z.string().min(1, { message: 'Required' }),
    locationDescription: z.string().optional().or(z.literal('')),
})
export type AdminPlotValues = z.infer<typeof AdminPlotSchema>