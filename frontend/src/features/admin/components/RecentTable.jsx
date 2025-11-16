import React from "react";
import { Table, Button } from "react-bootstrap";

export default function RecentTable({ data = [] }) {
    return (
        <Table hover responsive className="table-admin">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.title}</td>
                        <td>{row.author}</td>
                        <td>{row.created}</td>
                        <td>
                            <Button size="sm" variant="outline-secondary" className="me-2">View</Button>
                            <Button size="sm" variant="primary">Approve</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
