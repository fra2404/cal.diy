import { stripCRLF } from "@calcom/lib/sanitizeCRLF";
import { validateSmtpHost } from "@calcom/lib/validateSmtpHost";
import { z } from "zod";

export const ZListSmtpConfigurationsInputSchema = z.object({
  teamId: z.number(),
});

export type TListSmtpConfigurationsInput = z.infer<typeof ZListSmtpConfigurationsInputSchema>;

export const ZGetSmtpConfigurationInputSchema = z.object({
  teamId: z.number(),
  id: z.number(),
});

export type TGetSmtpConfigurationInput = z.infer<typeof ZGetSmtpConfigurationInputSchema>;

export const ZCreateSmtpConfigurationInputSchema = z.object({
  teamId: z.number(),
  fromEmail: z.string().email().transform(stripCRLF),
  fromName: z.string().min(1).transform(stripCRLF),
  smtpHost: z
    .string()
    .min(1)
    .transform(stripCRLF)
    .refine(validateSmtpHost, { message: "SMTP host must be a public address" }),
  smtpPort: z.coerce.number().int().min(1).max(65535),
  smtpUser: z
    .string()
    .transform(stripCRLF)
    .refine((value) => value.length > 0, { message: "SMTP username is required" }),
  smtpPassword: z
    .string()
    .transform(stripCRLF)
    .refine((value) => value.length > 0, { message: "SMTP password is required" }),
  smtpSecure: z.boolean().default(true),
});

export type TCreateSmtpConfigurationInput = z.infer<typeof ZCreateSmtpConfigurationInputSchema>;

export const ZUpdateSmtpConfigurationInputSchema = z.object({
  teamId: z.number(),
  id: z.number(),
  fromEmail: z.string().email().transform(stripCRLF).optional(),
  fromName: z.string().min(1).transform(stripCRLF).optional(),
  smtpHost: z
    .string()
    .min(1)
    .transform(stripCRLF)
    .refine(validateSmtpHost, { message: "SMTP host must be a public address" })
    .optional(),
  smtpPort: z.coerce.number().int().min(1).max(65535).optional(),
  smtpUser: z
    .string()
    .transform(stripCRLF)
    .refine((value) => value.length > 0, { message: "SMTP username is required" })
    .optional(),
  smtpPassword: z
    .string()
    .transform(stripCRLF)
    .refine((value) => value.length > 0, { message: "SMTP password is required" })
    .optional(),
  smtpSecure: z.boolean().optional(),
});

export type TUpdateSmtpConfigurationInput = z.infer<typeof ZUpdateSmtpConfigurationInputSchema>;

export const ZDeleteSmtpConfigurationInputSchema = z.object({
  teamId: z.number(),
  id: z.number(),
});

export type TDeleteSmtpConfigurationInput = z.infer<typeof ZDeleteSmtpConfigurationInputSchema>;

export const ZTestSmtpConnectionInputSchema = z.object({
  teamId: z.number(),
  fromEmail: z.string().email().transform(stripCRLF).optional(),
  fromName: z.string().min(1).transform(stripCRLF).optional(),
  smtpHost: z
    .string()
    .min(1)
    .transform(stripCRLF)
    .refine(validateSmtpHost, { message: "SMTP host must be a public address" }),
  smtpPort: z.coerce.number().int().min(1).max(65535),
  smtpUser: z
    .string()
    .transform(stripCRLF)
    .refine((value) => value.length > 0, { message: "SMTP username is required" })
    .optional(),
  smtpPassword: z
    .string()
    .transform(stripCRLF)
    .refine((value) => value.length > 0, { message: "SMTP password is required" })
    .optional(),
  smtpSecure: z.boolean().default(true),
  configId: z.number().optional(),
});

export type TTestSmtpConnectionInput = z.infer<typeof ZTestSmtpConnectionInputSchema>;

export const ZSendSmtpTestEmailInputSchema = z.object({
  teamId: z.number(),
  id: z.number(),
});

export type TSendSmtpTestEmailInput = z.infer<typeof ZSendSmtpTestEmailInputSchema>;