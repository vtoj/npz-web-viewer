import { useRef, useEffect } from "react";

interface GrayscaleImageProps {
  data: number[][];
}

export default function GrayscaleImage({ data }: GrayscaleImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on the array size
    const rows = data.length;
    const cols = data[0].length;
    canvas.width = cols;
    canvas.height = rows;

    // Compute min and max values with a simple nested loop to avoid spreading a large array
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const value = data[i][j];
        if (value < minVal) minVal = value;
        if (value > maxVal) maxVal = value;
      }
    }
    // Avoid division by zero if all values are equal
    const range = maxVal - minVal || 1;

    // Create image data
    const imageData = ctx.createImageData(cols, rows);
    let index = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const normalizedValue = Math.round(
          ((data[i][j] - minVal) / range) * 255,
        );
        imageData.data[index++] = normalizedValue; // Red
        imageData.data[index++] = normalizedValue; // Green
        imageData.data[index++] = normalizedValue; // Blue
        imageData.data[index++] = 255; // Alpha (fully opaque)
      }
    }

    // Draw image on canvas
    ctx.putImageData(imageData, 0, 0);
  }, [data]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Grayscale Image</h3>
      <canvas ref={canvasRef} className="border w-full" />
    </div>
  );
}
