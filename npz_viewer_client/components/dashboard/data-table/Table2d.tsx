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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import LineChart from '../charts/chart'
import ScatterPlot from '../charts/scatterplot'
import GrayscaleImage from '../charts/greyscale'
import Scatter3D from '../charts/scatter3d'
import Surface3D from '../charts/surface3d'

interface Table2DProps {
  data: number[][]
  fileName: string
}

export default function Table2D({ data }: Table2DProps) {
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
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scatter">Scatter Plot</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="grayscale">Grayscale Image</SelectItem>
            <SelectItem value="scatter3d">Scatter3D</SelectItem>
            <SelectItem value="surface3d">Surface3D</SelectItem>
          </SelectContent>
        </Select>
        {chartType && (
          <Button onClick={() => setChartType(null)} className="ml-4">
            Hide Chart
          </Button>
        )}
      </div>

      {chartType && <div className="mt-4">{renderChart()}</div>}
    </div>
  )
}
