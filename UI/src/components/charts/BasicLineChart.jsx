import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicLineChart({ dataset = [] }) {
  if (!dataset.length) {
    return <p className="text-gray-400">No data available</p>;
  }

  return (
    <LineChart
      dataset={dataset}
      xAxis={[{ dataKey: 'index', label: 'Index' }]}
      series={[{ dataKey: 'close', label: 'Close Price' }]}
      height={300}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}
