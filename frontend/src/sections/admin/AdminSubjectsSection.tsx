import React from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Form,
    InputGroup,
    Badge,
    Modal
} from 'react-bootstrap';
import { FaSearch, FaEye, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import type { ISubject, SubjectStatus } from '../../types/subject';
import { useSubject } from '../../hooks/useSubject';
import styles from './scss/AdminSubjectsSection.module.scss';

const getStatusBadge = (status: SubjectStatus) => {
    switch (status) {
        case 'ACTIVE':
            return <Badge bg="success">Active</Badge>;
        case 'PENDING':
            return <Badge bg="warning">Pending</Badge>;
        case 'REJECTED':
            return <Badge bg="danger">Rejected</Badge>;
        case 'INACTIVE':
            return <Badge bg="secondary">Inactive</Badge>;
        default:
            return <Badge bg="secondary">{status}</Badge>;
    }
};

const AdminSubjectsSection = () => {
    const {
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        showModal,
        modalType,
        selectedSubject,
        loading,
        error,
        actionLoading,
        filteredSubjects,
        handleShowModal,
        handleCloseModal,
        handleApprove,
        handleReject,
        handleDelete
    } = useSubject();

    return (
        <div className={styles.adminSubjectsPage}>
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <h2 className={`${styles.textGradient} fw-bold`}>Quan tri mon hoc</h2>
                        <p className={styles.mutedText}>Quan ly tat ca cac mon hoc va tai lieu khoa hoc</p>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={6}>
                        <InputGroup>
                            <InputGroup.Text><FaSearch /></InputGroup.Text>
                            <Form.Control
                                placeholder="Tim kiem theo ten mon hoc hoac nguoi ban..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="All">Tat ca trang thai</option>
                            <option value="PENDING">Dang cho</option>
                            <option value="ACTIVE">Hoat dong</option>
                            <option value="REJECTED">Bi tu choi</option>
                            <option value="INACTIVE">Khong hoat dong</option>
                        </Form.Select>
                    </Col>
                </Row>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Dang tai...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <Row>
                        <Col>
                            <Card className={styles.subjectsTableCard}>
                                <Card.Body>
                                    <div className="table-responsive">
                                        <Table hover variant="dark" className={styles.customTable}>
                                            <thead>
                                                <tr>
                                                    <th>Subject Name</th>
                                                    <th>Seller</th>
                                                    <th>Price</th>
                                                    <th>Questions</th>
                                                    <th>Status</th>
                                                    <th>Created Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredSubjects.map((subject) => (
                                                    <tr key={subject.id}>
                                                        <td className="fw-semibold">{subject.name}</td>
                                                        <td className={styles.mutedText}>{subject.createUser?.name}</td>
                                                        <td>{subject.price.toLocaleString('vi-VN')}d</td>
                                                        <td>{subject.questionCount}</td>
                                                        <td>{getStatusBadge(subject.status)}</td>
                                                        <td>{new Date(subject.createdAt).toLocaleDateString('vi-VN')}</td>
                                                        <td>
                                                            <div className={styles.actionButtons}>
                                                                <Button
                                                                    variant="outline-info"
                                                                    size="sm"
                                                                    onClick={() => handleShowModal('view', subject)}
                                                                >
                                                                    <FaEye />
                                                                </Button>
                                                                {subject.status === 'PENDING' && (
                                                                    <>
                                                                        <Button
                                                                            variant="outline-success"
                                                                            size="sm"
                                                                            onClick={() => handleShowModal('approve', subject)}
                                                                        >
                                                                            <FaCheck />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline-warning"
                                                                            size="sm"
                                                                            onClick={() => handleShowModal('reject', subject)}
                                                                        >
                                                                            <FaTimes />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleShowModal('delete', subject)}
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton className={styles.modalHeaderCustom}>
                        <Modal.Title>
                            {modalType === 'view' && 'Subject Details'}
                            {modalType === 'approve' && 'Approve Subject'}
                            {modalType === 'reject' && 'Reject Subject'}
                            {modalType === 'delete' && 'Delete Subject'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={styles.modalBodyCustom}>
                        {modalType === 'view' && selectedSubject && (
                            <div>
                                <p><strong>Name:</strong> {selectedSubject.name}</p>
                                <p><strong>Seller:</strong> {selectedSubject.createUser?.name}</p>
                                <p><strong>Price:</strong> {selectedSubject.price.toLocaleString('vi-VN')}d</p>
                                <p><strong>Total Questions:</strong> {selectedSubject.questionCount}</p>
                                <p><strong>Status:</strong> {getStatusBadge(selectedSubject.status)}</p>
                                <p><strong>Created:</strong> {new Date(selectedSubject.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                        )}
                        {modalType === 'approve' && (
                            <p>Are you sure you want to approve <strong>{selectedSubject?.name}</strong>?</p>
                        )}
                        {modalType === 'reject' && (
                            <p>Are you sure you want to reject <strong>{selectedSubject?.name}</strong>?</p>
                        )}
                        {modalType === 'delete' && (
                            <p>Are you sure you want to delete <strong>{selectedSubject?.name}</strong>? This action cannot be undone.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer className={styles.modalFooterCustom}>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={actionLoading}>
                            Cancel
                        </Button>
                        {modalType === 'approve' && (
                            <Button variant="success" onClick={handleApprove} disabled={actionLoading}>
                                Approve
                            </Button>
                        )}
                        {modalType === 'reject' && (
                            <Button variant="warning" onClick={handleReject} disabled={actionLoading}>
                                Reject
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <Button variant="danger" onClick={handleDelete} disabled={actionLoading}>
                                Delete
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminSubjectsSection;
