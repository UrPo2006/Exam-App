'use client'
import { FileImage, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import useUploadImage from '@/hooks/use-uploud-image';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface Props {
  onUploadSuccess: (url: string) => void;
  preview: string | null; // إضافة هذا السطر
  setPreview: (url: string | null) => void; // إضافة هذا السطر
  error?: string;
}
export default function ImageField({ onUploadSuccess, preview, setPreview, error }: Props) {
  const { mutate: uploadImage, isPending, uploadProgress } = useUploadImage();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    setPreview(URL.createObjectURL(file));

    // Upload the file
    uploadImage(
      { image: file },
      {
        onSuccess: (data) => {
          onUploadSuccess(data.url);
         
        },
     
        onError: (err) => {
          console.error('Upload failed:', err.message);
        },
      }
    );
  };

  return (
    <FormItem>
      <FormLabel className="font-bold font-mono">Image</FormLabel>
      <FormControl>
        <div>
          <label className="border-2 p-10 flex items-center  justify-between cursor-pointer hover:bg-slate-50">
            <FileImage className="w-10 h-10 text-slate-300" />

            <div className="flex  w-226 h-10 items-center justify-center gap-3">
              <UploadCloud className="w-6 h-6 text-slate-400" />
              <p className="text-sm text-slate-500 font-mono">
                {isPending
                  ? `Uploading... ${uploadProgress}%`
                  : <>Drop an image here or{' '}
                    <span className="text-blue-600">select from your computer</span>
                  </>
                }
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isPending}
              />
            </div>
          </label>

          {/* Progress Bar */}
          {isPending && (
            <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Preview */}
          {preview && (
            <img src={preview} className="mt-3 w-32 h-32 object-cover rounded" />
          )}
        </div>
      </FormControl>

      {/* Show error if passed from parent */}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </FormItem>
  );
}