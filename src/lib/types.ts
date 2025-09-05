import { z } from "zod"

export const AralSchema = z.object({
  id: z.number().min(1, "ID is required"),
  source_name: z.string().min(2, "Source name is needed"),
  category: z.string().min(2, "Category is needed"),
  field: z.string().min(2, "Source name is needed")
})

export type Aral = z.infer<typeof AralSchema>
