import React from "react";
import { Card } from "react-bootstrap";

export default function StatsCard({ label, value, change }) {
    return (
        <Card className="stats-card h-100">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div className="label">{label}</div>
                    <div className="value display-6">{value}</div>
                </div>
                <div className="mt-3 text-white small">Change: <span className="change">{change}</span></div>
            </Card.Body>
        </Card>
    );
}
