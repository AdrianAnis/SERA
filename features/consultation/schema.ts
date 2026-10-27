import { z } from "zod"

export const consultationDateKeySchema = z.iso.date()
