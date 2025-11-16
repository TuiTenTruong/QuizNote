import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#7C3AED", "#FB7185", "#F59E0B", "#10B981", "#3B82F6"];

export default function SubjectPie({ data = [] }) {
    if (!data || data.length === 0) return <div className="text-muted">No data</div>;

    return (
        <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {data.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
