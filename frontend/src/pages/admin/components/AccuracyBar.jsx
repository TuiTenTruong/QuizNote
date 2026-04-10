import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function AccuracyBar({ data = [] }) {
    if (!data || data.length === 0) return <div className="text-muted">No data</div>;

    return (
        <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2b2b2b" />
                    <XAxis dataKey="subject" stroke="#9aa4b2" />
                    <YAxis stroke="#9aa4b2" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
