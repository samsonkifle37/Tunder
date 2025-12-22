import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FrequencyChart = ({ data, title, color, minY = 0 }) => {
    // Transform data object { "1": 10, ... } to array [{name: "1", count: 10}, ...]
    const chartData = Object.entries(data).map(([num, count]) => ({
        number: num,
        count: count
    }));

    return (
        <div className="chart-container">
            <h3>{title}</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="number" tick={{ fontSize: 12 }} interval={0} />
                        <YAxis domain={[minY, 'auto']} />
                        <Tooltip />
                        <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FrequencyChart;
