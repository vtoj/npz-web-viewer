import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js'
import { Scatter } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title)

interface HeatmapProps {
  data: number[][]
}

export default function Heatmap({ data }: HeatmapProps) {
  const numRows = data.length
  const numCols = data[0]?.length || 0

  // Generate scatter data for the heatmap
  const scatterData = []
  const backgroundColors = []

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const value = data[rowIndex][colIndex]
      scatterData.push({ x: colIndex, y: rowIndex, value })
      backgroundColors.push(`rgba(33, 150, 243`)
    }
  }

  const chartData = {
    labels: Array.from({ length: numCols }, (_, i) => `Col ${i + 1}`),
    datasets: [
      {
        label: 'Heatmap',
        data: scatterData.map((point) => ({
          x: point.x,
          y: point.y,
          r: Math.abs(point.value) + 15, // Point size
        })),
        backgroundColor: backgroundColors,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Columns' },
        ticks: { stepSize: 1 },
      },
      y: {
        title: { display: true, text: 'Rows' },
        ticks: { stepSize: 1, reverse: true }, // Flip Y-axis for intuitive top-to-bottom layout
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const { x, y } = context.raw
            const value = data[y][x]
            return `Value: ${value}`
          },
        },
      },
    },
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Scatter data={chartData} options={chartOptions} />
    </div>
  )
}

