import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title)

interface LineChartProps {
  data: number[][]
}

export default function LineChart({ data }: LineChartProps) {
  const numRows = data.length
  const numCols = data[0]?.length || 0

  // Generate labels for the X-axis (columns)
  const labels = Array.from({ length: numCols }, (_, i) => `Column ${i + 1}`)

  // Generate datasets for each row
  const datasets = data.map((row, rowIndex) => ({
    label: `Row ${rowIndex + 1}`,
    data: row,
    borderColor: `hsl(${(rowIndex * 360) / numRows}, 70%, 50%)`, // Unique color for each row
    backgroundColor: `hsl(${(rowIndex * 360) / numRows}, 70%, 70%)`,
    tension: 0.4, // Add smooth curves
  }))

  const chartData = {
    labels,
    datasets,
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const, // Explicitly set the type to one of the allowed values
      },
      title: {
        display: true,
        text: 'Line Chart Visualization',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Columns',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

