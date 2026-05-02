import { imageSchema } from "@/schemes/image.schemas";

export type IImageFields = z.infer<typeof imageSchema>;
export interface IUploudImageResponse{
    url:string;
}