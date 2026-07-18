import { z } from "zod";

export const systemStatusSchema = z.object({
  service: z.literal("business-os-backend"),
  status: z.literal("available"),
});

export type SystemStatus = z.infer<typeof systemStatusSchema>;
