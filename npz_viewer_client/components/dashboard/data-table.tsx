import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import LineChart from './chart'
import ScatterPlot from './scatterplot'
import GrayscaleImage from './greyscale'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Scatter3D from './scatter3d'
import Surface3D from './surface3d'

interface ArrayData {
  size: any
  ndim: number
  data: any[]
}

interface DataTableProps {
  data: Record<string, Record<string, ArrayData>> // Adjusted for multiple files
}

export default function DataTable({ data }: DataTableProps) {
  const downloadCSV = (arrayData: number[][], fileName: string) => {
    // Convert array to CSV string
    const csvContent = arrayData.map((row) => row.join(',')).join('\n')

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv' })

    // Create a download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {Object.entries(data).map(([fileName, arrays]) => (
        <div key={fileName} className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            File: {fileName}
          </h2>
          {Object.entries(arrays).map(([arrayName, arrayData]) => (
            <div key={arrayName} className="border rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {arrayName} <span className="text-gray-500 text-xs">({arrayData.ndim}D Array)</span>
              </h3>
              {arrayData.ndim === 2 ? (
                <div>
                  <Table2D data={arrayData.data} />
                  <div className='flex w-full items-center justify-between'>
                    <Button
                      onClick={() => downloadCSV(arrayData.data, `${fileName}-${arrayName}`)}
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
          ))}
        </div>
      ))}
    </div>
  )
}

function Table2D({ data }: { data: number[][] }) {
  const [chartType, setChartType] = useState<string | null>(null)

  const renderChart = () => {
    if (!chartType) return null

    switch (chartType) {
      case 'scatter':
        return <ScatterPlot data={data} />
      case 'line':
        return <LineChart data={data} />
      case 'grayscale':
        return <GrayscaleImage data={data} />
      case 'scatter3d':
        return <Scatter3D data={data} />
      case 'surface3d':
        return <Surface3D data={data} />
      default:
        return null
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {data[0].map((_, colIndex) => (
              <TableHead key={colIndex} className="text-center">
                Column {colIndex + 1}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="text-center">
                  {typeof cell === 'number' ? cell.toFixed(4) : cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <Select
          onValueChange={(value) => setChartType(value)}
          value={chartType || ''}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scatter">Scatter Plot</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="grayscale">Grayscale Image</SelectItem>
            <SelectItem value="surface3d">Surface3d</SelectItem>
            <SelectItem value="scatter3d">Scatter3d</SelectItem>
          </SelectContent>
        </Select>
        {chartType && (
          <Button
            onClick={() => setChartType(null)}
            className="ml-4"
          >
            Hide Chart
          </Button>
        )}
      </div>

      {chartType && <div className="mt-4">{renderChart()}</div>}
    </div>
  )
}

function MultiDimensionalArray({ data, depth }: { data: any[]; depth: number }) {
  const [isOpen, setIsOpen] = useState(false)

  if (Array.isArray(data[0]) && Array.isArray(data[0][0])) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <ChevronRight className={`mr-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            {`Dimension ${depth + 1} (${data.length} items)`}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4 mt-2 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">Index {index}:</h3>
              {Array.isArray(item[0]) ? (
                <MultiDimensionalArray data={item} depth={depth + 1} />
              ) : (
                <Table2D data={item} />
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  } else if (Array.isArray(data[0])) {
    return <Table2D data={data} />
  } else {
    return (
      <div className="ml-4">
        [{data.map((value, index) => (
          <span key={index}>
            {typeof value === 'number' ? value.toFixed(4) : value}
            {index < data.length - 1 ? ', ' : ''}
          </span>
        ))}]
      </div>
    )
  }
}

