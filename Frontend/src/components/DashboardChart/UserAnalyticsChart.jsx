import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8B5CF6", "#3B82F6", "#22C55E", "#FACC15", "#EF4444"];

const UserAnalyticsChart = ({ users }) => {
  const [period, setPeriod] = useState("monthly");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (users && users.length > 0) {
      calculateChartData(users, period);
    }
  }, [users, period]);

  const calculateChartData = (users, period) => {
    const now = new Date();
    let filtered = [];

    if (period === "daily") {
      filtered = users.filter(
        (u) => new Date(u.createdAt).toDateString() === now.toDateString()
      );
      setChartData([
        { name: "Today", value: filtered.length },
        { name: "Earlier", value: users.length - filtered.length },
      ]);
    } else if (period === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      filtered = users.filter((u) => new Date(u.createdAt) >= weekAgo);
      setChartData([
        { name: "Last 7 Days", value: filtered.length },
        { name: "Older", value: users.length - filtered.length },
      ]);
    } else if (period === "monthly") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      filtered = users.filter((u) => new Date(u.createdAt) >= monthAgo);
      setChartData([
        { name: "Last 30 Days", value: filtered.length },
        { name: "Older", value: users.length - filtered.length },
      ]);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl mb-8 shadow-md border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">New Users Overview</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="flex justify-center">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                label={{ fill: "#fff", fontSize: 12 }}
                stroke="#1F2937"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #4B5563",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsChart;
