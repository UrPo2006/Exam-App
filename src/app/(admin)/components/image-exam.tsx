'use client';
import { Download, FileImage, Trash2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import useUploadImage from '@/hooks/use-uploud-image';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface Props {
  onUploadSuccess: (url: string) => void;
  preview: string | null; // إضافة هذا السطر
  setPreview: (url: string | null) => void; // إضافة هذا السطر
  error?: string;
}
export default function ImageExam({ onUploadSuccess, preview, setPreview, error }: Props) {
  const { mutate: uploadImage, isPending, uploadProgress } = useUploadImage();

  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileDetails({ name: file.name, size: `${sizeInMB} MB` });
    setPreview(URL.createObjectURL(file));

    uploadImage(
      { image: file },
      {
        onSuccess: (data) => {
          onUploadSuccess(data.url);
        },
      }
    );
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreview(null);
    setFileDetails(null);
    onUploadSuccess("");
  };

  return (
    <FormItem>
      <FormLabel className="text-slate-800 font-semibold mb-2 block">Image</FormLabel>
      <FormControl>
        <div className="relative border border-slate-200 rounded-md p-3 bg-white min-h-[100px] flex items-center">
          {!preview ? (
          
            <label className="flex items-center justify-center w-full gap-3 cursor-pointer hover:bg-slate-50 transition-colors py-4">
              <UploadCloud className="w-6 h-6 text-slate-400" />
              <p className="text-sm text-slate-500 font-mono">
                {isPending ? `Uploading... ${uploadProgress}%` : "Click to upload an image"}
              </p>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isPending} />
            </label>
          ) : (
      
            <div className="flex items-center w-full gap-4">
              {/* صورة المعاينة */}
              <div className="w-20 h-20 rounded overflow-hidden border border-slate-100 flex-shrink-0">
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              </div>

              {/* تفاصيل الملف */}
              <div className="flex flex-1 items-center justify-between font-mono text-sm text-slate-500">
                <span className="truncate max-w-[200px] text-slate-700">{fileDetails?.name}</span>
                
                <div className="flex items-center gap-6">
                  <span>{fileDetails?.size}</span>
                  
                  {/* أزرار الأكشن */}
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={removeImage} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* شريط التحميل (يظهر أسفل البوردر عند الرفع) */}
          {isPending && (
            <div className="absolute bottom-0 left-0 w-full bg-slate-100 h-1 overflow-hidden rounded-b-md">
              <div 
                className="bg-blue-600 h-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }} 
              />
            </div>
          )}
        </div>
      </FormControl>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </FormItem>
  );
}