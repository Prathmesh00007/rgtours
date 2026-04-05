import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";
import { format } from "timeago.js";

export default function Chart({ data }) {
  const realData = data?.map((item) => ({
    price: item.totalPrice,
    date: format(item.createdAt),
  }));

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-travel-dark mb-6">Bookings Overview</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={realData}>
            <Tooltip
              content={(props) => (
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4">
                  {props.payload?.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-bold text-travel-dark">
                        Price: <span className="text-travel-success">${item.value}</span>
                      </p>
                      <p className="text-sm text-gray-600">Date: {item.payload.date}</p>
                    </div>
                  ))}
                </div>
              )}
            />
            <YAxis 
              dataKey="price" 
              stroke="#64748b"
              tick={{ fill: "#64748b" }}
            />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              tick={{ fill: "#64748b" }}
            />
            <Bar 
              dataKey="price" 
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
