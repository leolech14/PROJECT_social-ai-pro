import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const generateScriptSchema = z.object({
  description: z.string().min(1).max(500),
  tone: z.enum(['Educational', 'Fun', 'Professional', 'Inspiring']),
  platforms: z.array(z.enum(['TikTok', 'Instagram', 'YouTube'])).min(1),
  duration: z.coerce.number().int().min(10).max(120)
})

export const generateDemosSchema = z.object({
  description: z.string().min(1).max(500),
  tone: z.enum(['Educational', 'Fun', 'Professional', 'Inspiring']),
  platforms: z.array(z.enum(['TikTok', 'Instagram', 'YouTube'])).min(1),
  duration: z.coerce.number().int().min(10).max(120).optional()
})

export const voicePreviewSchema = z.object({
  voiceId: z.string().min(1),
  demoText: z.string().min(1).max(500),
  voiceInstruction: z.string().max(200).optional()
})

export const generateVoiceSchema = z.object({
  scriptId: z.coerce.number().int().positive(),
  voiceId: z.string().min(1),
  text: z.string().min(1).max(1000),
  voiceInstruction: z.string().max(200).optional()
})

export const searchMediaSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['video', 'image', 'music']).default('video'),
  duration: z.coerce.number().int().min(1).max(300).optional(),
  count: z.coerce.number().int().min(1).max(50).optional()
})

export const assembleVideoSchema = z.object({
  scriptId: z.coerce.number().int().positive(),
  voiceId: z.string().min(1),
  mediaIds: z.array(z.string().min(1)).optional(),
  musicId: z.string().optional(),
  settings: z.object({
    duration: z.coerce.number().int().min(10).max(120).optional()
  }).optional()
})
