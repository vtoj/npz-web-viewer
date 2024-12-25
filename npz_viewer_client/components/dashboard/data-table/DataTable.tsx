"use client"

import { useEffect, useRef, useState } from "react"
import Lenis from "lenis"
import { downloadCSV } from "@/utils/csv-utils"
import Table2D from "./Table2d"
import MultiDimensionalArray from "./MultiDimensionalArray"
import { Button } from "@/components/ui/button"
import { ChevronsDown } from "lucide-react"

interface ArrayData {
  size: any
  ndim: number
  data: any[]
}

interface DataTableProps {
  data: Record<string, Record<string, ArrayData>> // Adjusted for multiple files
}

export default function DataTable({ data }: DataTableProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const downloadRefs = useRef<HTMLButtonElement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0) // Tracks the current download button index

  useEffect(() => {
    const lenis = new Lenis()
    lenisRef.current = lenis

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const scrollToNextDownload = () => {
    if (lenisRef.current && downloadRefs.current.length > 0) {
      const target = downloadRefs.current[currentIndex]

      if (target) {
        lenisRef.current.scrollTo(target, { duration: 2.5, offset: -500})
        setCurrentIndex((prevIndex) => (prevIndex + 1) % downloadRefs.current.length)
      }
    }
  }

  return (
    <div className="relative space-y-8">
      {/* Scroll to Download Button */}
      <button
        onClick={scrollToNextDownload}
        className="fixed bottom-8 right-8 z-50 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition"
        aria-label="Scroll to Next Download"
      >
        <ChevronsDown className="h-6 w-6" />
      </button>

      {Object.entries(data).map(([fileName, arrays], fileIndex) => (
        <div key={fileName} className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            File: {fileName}
          </h2>
          {Object.entries(arrays).map(([arrayName, arrayData], arrayIndex) => {
            const downloadIndex = fileIndex + arrayIndex
            return (
              <div
                key={arrayName}
                className="border rounded-lg p-4 mb-4"

              >
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {arrayName} <span className="text-gray-500 text-xs">({arrayData.ndim}D Array)</span>
                </h3>
                {arrayData.ndim === 2 ? (
                  <div>
                    <Table2D
                      data={arrayData.data}
                      fileName={`${fileName}-${arrayName}`}
                    />
                    <div className="flex w-full items-center justify-between">
                      <Button
                      ref={(el) => {
                          if (el) downloadRefs.current[downloadIndex] = el
                            }}
                        onClick={() =>
                          downloadCSV(arrayData.data, `${fileName}-${arrayName}`)
                        }
                        className="mt-4"
                      >
                        Download CSV
                      </Button>
                    </div>
                  </div>
                ) : (
                  <MultiDimensionalArray data={arrayData.data} depth={0} />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
