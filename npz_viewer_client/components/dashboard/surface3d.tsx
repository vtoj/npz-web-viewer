import Plot from 'react-plotly.js'

interface Surface3DProps {
  data: number[][]
}

export default function Surface3D({ data }: Surface3DProps) {
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

