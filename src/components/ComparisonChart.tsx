import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { ComparisonResult } from "../types";

interface ComparisonChartProps {
  comparisonResult: ComparisonResult;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  comparisonResult,
}) => {
  const { traditional, genetic, salp } = comparisonResult;

  const data = [
    {
      name: "Average Distance (km)",
      Traditional: traditional.metrics.avgDistance,
      Genetic: genetic.metrics.avgDistance,
      Salp: salp.metrics.avgDistance,
    },
    {
      name: "Maximum Distance (km)",
      Traditional: traditional.metrics.maxDistance,
      Genetic: genetic.metrics.maxDistance,
      Salp: salp.metrics.maxDistance,
    },
    {
      name: "Coverage within 5km (%)",
      Traditional: traditional.metrics.coverage5km,
      Genetic: genetic.metrics.coverage5km,
      Salp: salp.metrics.coverage5km,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Comparison of Methods</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Legend />
          <Bar dataKey="Traditional" fill="#ff6b6b" name="Traditional Method">
            <LabelList
              dataKey="Traditional"
              position="top"
              formatter={(value) => value.toFixed(2)}
            />
          </Bar>
          <Bar dataKey="Genetic" fill="#845ef7" name="Genetic Algorithm">
            <LabelList
              dataKey="Genetic"
              position="top"
              formatter={(value) => value.toFixed(2)}
            />
          </Bar>
          <Bar dataKey="Salp" fill="#12b886" name="Salp Swarm Algorithm">
            <LabelList
              dataKey="Salp"
              position="top"
              formatter={(value) => value.toFixed(2)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">
          Improvement Over Traditional
        </h3>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Metric</th>
              <th className="py-2 px-4 border-b">Genetic</th>
              <th className="py-2 px-4 border-b">Salp Swarm</th>
              <th className="py-2 px-4 border-b">Better is</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: "Average Distance (km)",
                key: "avgDistance",
                better: "Lower",
              },
              {
                label: "Maximum Distance (km)",
                key: "maxDistance",
                better: "Lower",
              },
              {
                label: "Coverage within 5km (%)",
                key: "coverage5km",
                better: "Higher",
              },
            ].map(({ label, key, better }) => (
              <tr key={key}>
                <td className="py-2 px-4 border-b">{label}</td>
                <td
                  className={`py-2 px-4 border-b ${
                    (comparisonResult.genetic.improvement?.[key] ?? 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(comparisonResult.genetic.improvement?.[key] ?? 0).toFixed(
                    2
                  )}
                  {key === "coverage5km" ? "%" : " km"}
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    (comparisonResult.salp.improvement?.[key] ?? 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(comparisonResult.salp.improvement?.[key] ?? 0).toFixed(2)}
                  {key === "coverage5km" ? "%" : " km"}
                </td>
                <td className="py-2 px-4 border-b">{better}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonChart;
