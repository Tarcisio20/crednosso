import { z } from "zod";

export const treasuryAddBalanceSchema = z.object({
    bills_10 : z.number().optional(),
    bills_20 : z.number().optional(),
    bills_50 : z.number().optional(),
    bills_100 : z.number().optional(),
})