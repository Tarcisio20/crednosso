import { z } from "zod";

const mmddyyyyRegex = /^(0[1-9]|1[0-2])-([0-2][0-9]|3[01])-\d{4}$/;

export const dateSearchSchema = z.object({
    date: z
    .string()
    .regex(mmddyyyyRegex, "Formato inválido, use MM-DD-AAAA")
    .refine((val) => {
      const [mm, dd, yyyy] = val.split("-").map(Number);
      const date = new Date(`${yyyy}-${mm}-${dd}`);
      return !isNaN(date.getTime());
    }, "Data inválida"),
})