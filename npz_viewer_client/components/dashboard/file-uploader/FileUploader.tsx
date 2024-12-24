'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import FileDropzone from './FileDropzone'
import UploadButton from './UploadButton'
import DataTable from '../data-table/DataTable'

interface ArrayData {
  size: any
  ndim: number
  data: any[]
}

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [data, setData] = useState<Record<string, Record<string, ArrayData>> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files before uploading.')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        toast.error('Upload failed.')
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setData(result)
      toast.success('Files uploaded successfully!')
    } catch (error) {
      toast.error('An unexpected error occurred.')
      console.error('Error uploading files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <FileDropzone files={files} setFiles={setFiles} />
      {files.length > 0 && (
        <UploadButton
          isLoading={isLoading}
          onClick={handleUpload}
          disabled={isLoading}
        />
      )}
      {data && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Analysis Results</h2>
          <DataTable data={data} />
        </Card>
      )}
    </div>
  )
}
