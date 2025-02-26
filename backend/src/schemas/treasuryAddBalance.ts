import { z } from "zod";

export const treasuryAddBalanceSchema = z.object({
    bills_10 : z.number({ message : 'Valor A é obrigatódio' }),
    bills_20 : z.number({ message : 'Valor B é obrigatódio' }),
    bills_50 : z.number({ message : 'Valor C é obrigatódio' }),
    bills_100 : z.number({ message : 'Valor D é obrigatódio' }),
})