'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface Scatter3DProps {
  data: number[][]
}

export default function Scatter3D({ data }: Scatter3DProps) {
  const [clientData, setClientData] = useState<{ x: number[]; y: number[]; z: number[] }>()

  useEffect(() => {
    if (!data) return

    // Transform data to 3D points
    const numRows = data.length
    const numCols = data[0]?.length || 0
    const x: number[] = []
    const y: number[] = []
    const z: number[] = []

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        x.push(col)
        y.push(row)
        z.push(data[row][col])
      }
    }

    setClientData({ x, y, z })
  }, [data])

  if (!clientData) {
    return <div>Loading 3D scatter plot...</div>
  }

  return (
    <Plot
      data={[
        {
          x: clientData.x,
          y: clientData.y,
          z: clientData.z,
          mode: 'markers',
          marker: {
            size: 5,
            color: clientData.z,
            colorscale: 'Viridis',
            showscale: true,
          },
          type: 'scatter3d',
        },
      ]}
      layout={{
        title: '3D Scatter Plot',
        scene: {
          xaxis: { title: 'Columns' },
          yaxis: { title: 'Rows' },
          zaxis: { title: 'Values' },
        },
        height: 600,
        width: 800,
      }}
    />
  )
}

