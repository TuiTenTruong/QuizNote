import React, { useEffect, useState } from 'react';
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
import {
    FaSearch,
    FaEye,
    FaCheck,
    FaTimes,
    FaTrash
} from 'react-icons/fa';
import './AdminSubjectsPage.scss';
import { getAllSubjects, approveSubject, rejectSubject, deleteSubject } from '../../services/apiService';
import { toast } from 'react-toastify';
const AdminSubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            const response = await getAllSubjects();
            if (response && response.statusCode === 200) {
                setSubjects(response.data.result);
            } else {
                console.error('Failed to fetch subjects data', response);
                toast.error('Không thể tải dữ liệu môn học. Vui lòng thử lại sau.');
            }
        };
        fetchSubjects();
    }, []);

    // Filter subjects
    const filteredSubjects = subjects.filter(subject => {
        const matchSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.seller.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'All' || subject.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleShowModal = (type, subject) => {
        setModalType(type);
        setSelectedSubject(subject);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSubject(null);
    };

    const handleApprove = async () => {
        try {
            const response = await approveSubject(selectedSubject.id);
            if (response && response.statusCode === 200) {
                setSubjects(subjects.map(s =>
                    s.id === selectedSubject.id ? { ...s, status: 'ACTIVE' } : s
                ));
                handleCloseModal();
            } else {
                console.error('Failed to approve subject', response);
                toast.error('Không thể duyệt môn học. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error approving subject:', error);
            toast.error('Lỗi khi duyệt môn học. Vui lòng thử lại.');
        }
    };

    const handleReject = async () => {
        try {
            const response = await rejectSubject(selectedSubject.id);
            if (response && response.statusCode === 200) {
                setSubjects(subjects.map(s =>
                    s.id === selectedSubject.id ? { ...s, status: 'REJECTED' } : s
                ));
                handleCloseModal();
            } else {
                console.error('Failed to reject subject', response);
                toast.error('Không thể từ chối môn học. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error rejecting subject:', error);
            toast.error('Lỗi khi từ chối môn học. Vui lòng thử lại.');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await deleteSubject(selectedSubject.id);
            if (response && response.statusCode === 200) {
                setSubjects(subjects.filter(s => s.id !== selectedSubject.id));
                handleCloseModal();
            } else {
                console.error('Failed to delete subject', response);
                toast.error('Không thể xóa môn học. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
            toast.error('Lỗi khi xóa môn học. Vui lòng thử lại.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge bg="success">Active</Badge>;
            case 'PENDING':
                return <Badge bg="warning">Pending</Badge>;
            case 'REJECTED':
                return <Badge bg="danger">Rejected</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="admin-subjects-page">
            <Container fluid>
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <h2 className="text-gradient fw-bold">Quản trị môn học</h2>
                        <p className="text-muted">Quản lý tất cả các môn học và tài liệu khóa học</p>
                    </Col>
                </Row>

                {/* Filters & Search */}
                <Row className="mb-4">
                    <Col md={6}>
                        <InputGroup>
                            <InputGroup.Text><FaSearch /></InputGroup.Text>
                            <Form.Control
                                placeholder="Tìm kiếm theo tên môn học hoặc người bán..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="All">Tất cả trạng thái</option>
                            <option value="PENDING">Đang chờ</option>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="REJECTED">Bị từ chối</option>
                            <option value="INACTIVE">Không hoạt động</option>
                        </Form.Select>
                    </Col>
                </Row>

                {/* Subjects Table */}
                <Row>
                    <Col>
                        <Card className="subjects-table-card">
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table hover variant="dark" className="custom-table">
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
                                                    <td className="text-muted">{subject.createUser.username}</td>
                                                    <td>{subject.price.toLocaleString('vi-VN')}đ</td>
                                                    <td>{subject.questionCount}</td>
                                                    <td>{getStatusBadge(subject.status)}</td>
                                                    <td>{subject.createdAt}</td>
                                                    <td>
                                                        <div className="action-buttons">
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

                {/* Modal */}
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            {modalType === 'view' && 'Subject Details'}
                            {modalType === 'approve' && 'Approve Subject'}
                            {modalType === 'reject' && 'Reject Subject'}
                            {modalType === 'delete' && 'Delete Subject'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        {modalType === 'view' && selectedSubject && (
                            <div>
                                <p><strong>Name:</strong> {selectedSubject.name}</p>
                                <p><strong>Seller:</strong> {selectedSubject.createUser.username}</p>
                                <p><strong>Price:</strong> {selectedSubject.price.toLocaleString('vi-VN')}đ</p>
                                <p><strong>Total Questions:</strong> {selectedSubject.questionCount}</p>
                                <p><strong>Status:</strong> {getStatusBadge(selectedSubject.status)}</p>
                                <p><strong>Created:</strong> {selectedSubject.createdAt}</p>
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
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        {modalType === 'approve' && (
                            <Button variant="success" onClick={handleApprove}>
                                Approve
                            </Button>
                        )}
                        {modalType === 'reject' && (
                            <Button variant="warning" onClick={handleReject}>
                                Reject
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <Button variant="danger" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminSubjectsPage;
