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

interface ScatterPlotProps {
  data: number[][]
}

export default function ScatterPlot({ data }: ScatterPlotProps) {
  const numRows = data.length
  const numCols = data[0]?.length || 0

  // Generate scatter data from 2D array
  const scatterData = []
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      scatterData.push({
        x: colIndex + 1, // Column index
        y: data[rowIndex][colIndex], // Value
      })
    }
  }

  const chartData = {
    datasets: [
      {
        label: 'Scatter Plot',
        data: scatterData,
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Scatter Plot Visualization',
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
      <Scatter data={chartData} options={chartOptions} />
    </div>
  )
}

