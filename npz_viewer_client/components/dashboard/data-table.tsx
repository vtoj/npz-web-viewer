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

interface ArrayData {
  size: any
  ndim: number
  data: any[]
}

interface DataTableProps {
  data: Record<string, ArrayData>
}

export default function DataTable({ data }: DataTableProps) {
  return (
    <div className="space-y-8">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">{key} <span className="text-gray-500 text-xs">({value.ndim}D Array)</span></h2>
          {value.ndim === 2 ? (
            <Table2D data={value.data} />
          ) : (
            <MultiDimensionalArray data={value.data} depth={0} />
          )}
        </div>
      ))}
    </div>
  )
}

function Table2D({ data }: { data: number[][] }) {
  return (
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
