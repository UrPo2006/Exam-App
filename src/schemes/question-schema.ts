import * as z from "zod";

const questionSchema = z.object({
  text: z.string().min(5, "السؤال قصير جداً"),
  answers: z.array(
    z.object({
      text: z.string().min(1, "الإجابة مطلوبة"),
      isCorrect: z.boolean(),
    })
  ).refine((ans) => ans.filter(a => a.isCorrect).length === 1, {
    message: "يجب اختيار إجابة واحدة صحيحة فقط",
  }),
});