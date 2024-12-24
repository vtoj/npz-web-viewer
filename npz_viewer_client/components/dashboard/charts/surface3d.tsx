'use client'

import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface Surface3DProps {
  data: number[][]
}

export default function Surface3D({ data }: Surface3DProps) {
  if (!data || data.length === 0) {
    return <div>No data available for 3D Surface Plot.</div>
  }

  return (
    <Plot
      data={[
        {
          z: data,
          type: 'surface',
          colorscale: 'Viridis',
          showscale: true,
        },
      ]}
      layout={{
        title: '3D Surface Plot',
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

