import { useRef, useEffect } from 'react'

interface GrayscaleImageProps {
  data: number[][]
}

export default function GrayscaleImage({ data }: GrayscaleImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas dimensions based on the array size
    const rows = data.length
    const cols = data[0].length
    canvas.width = cols
    canvas.height = rows

    // Normalize data to grayscale (0-255)
    const flatData = data.flat()
    const maxVal = Math.max(...flatData)
    const minVal = Math.min(...flatData)
    const normalize = (value: number) =>
      Math.round(((value - minVal) / (maxVal - minVal)) * 255)

    // Create image data
    const imageData = ctx.createImageData(cols, rows)
    let index = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const grayscaleValue = normalize(data[row][col])
        imageData.data[index++] = grayscaleValue // Red
        imageData.data[index++] = grayscaleValue // Green
        imageData.data[index++] = grayscaleValue // Blue
        imageData.data[index++] = 255 // Alpha (fully opaque)
      }
    }

    // Draw image on canvas
    ctx.putImageData(imageData, 0, 0)
  }, [data])

  return (
    <div className='w-full'>
      <h3 className="text-lg font-semibold mb-2">Grayscale Image</h3>
      <canvas ref={canvasRef} className="border w-full" />
    </div>
  )
}

