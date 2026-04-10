import React from "react";
import { Button } from "react-bootstrap";

export default function QuickActions() {
    return (
        <div className="d-flex flex-column gap-2">
            <Button variant="primary">Create quiz</Button>
            <Button variant="outline-secondary">Approve subject</Button>
            <Button variant="outline-secondary">Manage users</Button>
        </div>
    );
}
