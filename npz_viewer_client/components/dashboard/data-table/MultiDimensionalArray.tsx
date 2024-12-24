import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Table2D from './Table2d'

interface MultiDimensionalArrayProps {
  data: any[]
  depth: number
}

export default function MultiDimensionalArray({
  data,
  depth,
}: MultiDimensionalArrayProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (Array.isArray(data[0]) && Array.isArray(data[0][0])) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <ChevronRight
              className={`mr-2 h-4 w-4 transition-transform ${
                isOpen ? 'rotate-90' : ''
              }`}
            />
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
                <Table2D data={item} fileName={`dim-${depth + 1}-index-${index}`} />
              )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  } else if (Array.isArray(data[0])) {
    return <Table2D data={data} fileName={`dim-${depth}`} />
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
