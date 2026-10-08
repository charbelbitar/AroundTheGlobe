import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function BookingsChart({ data = [] }) {

  // Build the last 12 months, including months
  // with no bookings.
  const today = new Date();

  const chartData = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - 11 + index,
      1
    );

    const monthKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0')
    ].join('-');

    const record = data.find(
      (item) => item.month === monthKey
    );

    return {
      month: date.toLocaleDateString('en-US', {
        month: 'short'
      }),
      bookings: Number(record?.bookings ?? 0)
    };
  });

  return (
    <div className="dashboard-panel bookings-chart">

      <div className="chart-heading">
        <div>
          <h3>Bookings per Month</h3>
          <p>Confirmed bookings over the last 12 months</p>
        </div>
      </div>

      <div className="chart-container">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 5
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eeeeee"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#777', fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#777', fontSize: 12 }}
            />

            <Tooltip
              cursor={{ fill: '#fff3e8' }}
              formatter={(value) => [value, 'Bookings']}
            />

            <Bar
              dataKey="bookings"
              fill="#e58a38"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}