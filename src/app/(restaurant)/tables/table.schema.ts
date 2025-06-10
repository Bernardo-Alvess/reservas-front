import z from "zod";

export const TableSchema = z.object({
  tableNumber: z.string(),
  numberOfSeats: z.coerce.number(),
  isReserved: z.boolean(),
})

export type TableData = z.infer<typeof TableSchema> 
