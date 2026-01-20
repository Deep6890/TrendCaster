import { BarChart } from '@mui/x-charts/BarChart';

const rainfallData = [
    { month: 'Jan', rainfall: 42 },
    { month: 'Feb', rainfall: 55 },
    { month: 'Mar', rainfall: 30 },
    { month: 'Apr', rainfall: 65 },
    { month: 'May', rainfall: 90 },
    { month: 'Jun', rainfall: 120 },
    { month: 'Jul', rainfall: 180 },
    { month: 'Aug', rainfall: 160 },
    { month: 'Sep', rainfall: 110 },
    { month: 'Oct', rainfall: 70 },
    { month: 'Nov', rainfall: 40 },
    { month: 'Dec', rainfall: 25 },
];

const chartSetting = {
    xAxis: [
        {
            dataKey: 'rainfall',
            label: 'Rainfall (mm)',
        },
    ],
    height: 400,
    margin: { left: 60 },
};

const valueFormatter = (value) => `${value} mm`;

export default function HorizontalBars() {
    return (
        <BarChart
            dataset={rainfallData}
            yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[
                {
                    dataKey: 'rainfall',
                    label: 'Monthly Rainfall',
                    valueFormatter,
                },
            ]}
            layout="horizontal"
            {...chartSetting}
        />
    );
}
