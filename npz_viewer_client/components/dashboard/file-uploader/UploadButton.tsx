'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface UploadButtonProps {
  isLoading: boolean
  onClick: () => void
  disabled: boolean
}

export default function UploadButton({
  isLoading,
  onClick,
  disabled,
}: UploadButtonProps) {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onClick}
        disabled={disabled}
        size="lg"
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Analyze Files'
        )}
      </Button>
    </div>
  )
}
