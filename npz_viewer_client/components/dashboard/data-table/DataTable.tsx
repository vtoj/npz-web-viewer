import { downloadCSV } from '@/utils/csv-utils'
import Table2D from './Table2d'
import MultiDimensionalArray from './MultiDimensionalArray'
import { Button } from '@/components/ui/button'
interface ArrayData {
  size: any
  ndim: number
  data: any[]
}

interface DataTableProps {
  data: Record<string, Record<string, ArrayData>> // Adjusted for multiple files
}

export default function DataTable({ data }: DataTableProps) {
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
                  <Table2D
                    data={arrayData.data}
                    fileName={`${fileName}-${arrayName}`}
                  />
                  <div className="flex w-full items-center justify-between">
                    <Button
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
          ))}
        </div>
      ))}
    </div>
  )
}
