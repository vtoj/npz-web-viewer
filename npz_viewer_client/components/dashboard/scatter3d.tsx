import Plot from 'react-plotly.js'

interface Scatter3DProps {
  data: number[][]
}

export default function Scatter3D({ data }: Scatter3DProps) {
  const numRows = data.length
  const numCols = data[0]?.length || 0

  // Generate 3D data points
  const x = []
  const y = []
  const z = []

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      x.push(col)
      y.push(row)
      z.push(data[row][col])
    }
  }

  return (
    <Plot
      data={[
        {
          x,
          y,
          z,
          mode: 'markers',
          marker: {
            size: 5,
            color: z,
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

