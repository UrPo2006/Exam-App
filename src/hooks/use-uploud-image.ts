import { IImageFields, IUploudImageResponse } from '@/types/image'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import axios from 'axios';
import { IApiResponse } from '@/types/api';



export default function useUploadImage() {
 
  //States
    const [uploadProgress, setUploadProgress] = useState(0)
//Mutation
  const mutation = useMutation({
    mutationFn:async(fields:IImageFields)=>{
        const formData = new FormData()
        formData.append('image',fields.image)
        const response = await axios.post<IApiResponse<IUploudImageResponse>>('/api/upload',formData,{
          
         
          onUploadProgress:(progressEvent) => {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1)))
          }
        })
      
        
         if(response.data.status === false) throw new Error(response.data.message)
         return response.data.payload
    },
  })
  return {uploadProgress,
    ...mutation}
}