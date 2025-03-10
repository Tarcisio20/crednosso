import { z } from "zod";

export const orderGenerateReleaseSchema = z.array(z.number())
   