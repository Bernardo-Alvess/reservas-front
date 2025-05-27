import { z } from "zod";

const reserveSchema = z.object({
    email: z.string().email(),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    amountOfPeople: z.number().min(1),
    cpf: z.string().min(1),
    birthDate: z.string().min(1),
})

export default reserveSchema