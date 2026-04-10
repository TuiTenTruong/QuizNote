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
    Modal,
    Dropdown,
    Pagination
} from 'react-bootstrap';
import {
    FaSearch,
    FaUserPlus,
    FaEdit,
    FaTrash,
    FaBan,
    FaCheckCircle,
    FaEllipsisV
} from 'react-icons/fa';
import { useUser } from '../../hooks/useUser';
import styles from './scss/AdminUsersSection.module.scss';
import type { IAdminUser, IAdminUserFormData } from '../../types/user';

type ModalType = 'add' | 'edit' | 'delete' | '';
type FilterStatus = 'All' | 'Active' | 'Inactive';

const AdminUsersSection = () => {
    const {
        filteredUsers,
        searchTerm,
        setSearchTerm,
        filterRole,
        setFilterRole,
        filterStatus,
        setFilterStatus,
        showModal,
        modalType,
        selectedUser,
        errorMessages,
        formData,
        setFormData,
        roles,
        meta,
        handlePageChange,
        handleShowModal,
        handleCloseModal,
        handleSave,
        handleDelete,
        handleToggleBan
    } = useUser();

    return (
        <div className={styles.adminUsersPage}>
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <h2 className={`${styles.textGradient} fw-bold`}>Quan tri nguoi dung</h2>
                        <p className={styles.mutedText}>Quan ly tat ca nguoi dung, vai tro va quyen han</p>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text><FaSearch /></InputGroup.Text>
                            <Form.Control
                                placeholder="Tim kiem theo ten hoac email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                            <option value="All">Tat ca vai tro</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}>
                            <option value="All">Tat ca trang thai</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Select>
                    </Col>
                    <Col md={2} className="text-end">
                        <Button variant="primary" onClick={() => handleShowModal('add')}>
                            <FaUserPlus className="me-2" />
                            Them nguoi dung
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card className={styles.usersTableCard}>
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table hover variant="dark" className={styles.customTable}>
                                        <thead>
                                            <tr>
                                                <th>Ten</th>
                                                <th>Email</th>
                                                <th>Vai tro</th>
                                                <th>Trang thai</th>
                                                <th>Ngay tham gia</th>
                                                <th>Hanh dong</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="fw-semibold">{user.name}</td>
                                                        <td className={styles.mutedText}>{user.email}</td>
                                                        <td>
                                                            <Badge bg={
                                                                user.role?.name === 'SUPER_ADMIN' ? 'danger' :
                                                                    user.role?.name === 'SELLER' ? 'warning' :
                                                                        'info'
                                                            }>
                                                                {user.role?.name}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Badge bg={user.active ? 'success' : 'secondary'}>
                                                                {user.active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </td>
                                                        <td>{user.createdAt}</td>
                                                        <td>
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="outline-light" size="sm">
                                                                    <FaEllipsisV />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu variant="dark">
                                                                    <Dropdown.Item onClick={() => handleShowModal('edit', user)}>
                                                                        <FaEdit className="me-2" />Edit
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleToggleBan(user)}>
                                                                        {user.active ?
                                                                            <><FaBan className="me-2" />Ban</> :
                                                                            <><FaCheckCircle className="me-2" />Unban</>
                                                                        }
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Divider />
                                                                    <Dropdown.Item
                                                                        className="text-danger"
                                                                        onClick={() => handleShowModal('delete', user)}
                                                                    >
                                                                        <FaTrash className="me-2" />Delete
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center text-muted">
                                                        Khong co du lieu nguoi dung
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>

                                {meta.pages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div className={styles.mutedText}>
                                            Trang {meta.page} / {meta.pages} - Tong so {meta.total} nguoi dung
                                        </div>
                                        <Pagination className="mb-0">
                                            <Pagination.First
                                                onClick={() => handlePageChange(1)}
                                                disabled={meta.page === 1}
                                            />
                                            <Pagination.Prev
                                                onClick={() => handlePageChange(meta.page - 1)}
                                                disabled={meta.page === 1}
                                            />

                                            {[...Array(meta.pages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                if (
                                                    pageNumber === 1 ||
                                                    pageNumber === meta.pages ||
                                                    (pageNumber >= meta.page - 1 && pageNumber <= meta.page + 1)
                                                ) {
                                                    return (
                                                        <Pagination.Item
                                                            key={pageNumber}
                                                            active={pageNumber === meta.page}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                        >
                                                            {pageNumber}
                                                        </Pagination.Item>
                                                    );
                                                }

                                                if (pageNumber === meta.page - 2 || pageNumber === meta.page + 2) {
                                                    return <Pagination.Ellipsis key={pageNumber} disabled />;
                                                }

                                                return null;
                                            })}

                                            <Pagination.Next
                                                onClick={() => handlePageChange(meta.page + 1)}
                                                disabled={meta.page === meta.pages}
                                            />
                                            <Pagination.Last
                                                onClick={() => handlePageChange(meta.pages)}
                                                disabled={meta.page === meta.pages}
                                            />
                                        </Pagination>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton className={styles.modalHeaderCustom}>
                        <Modal.Title>
                            {modalType === 'add' && 'Them nguoi dung moi'}
                            {modalType === 'edit' && 'Chinh sua nguoi dung'}
                            {modalType === 'delete' && 'Xoa nguoi dung'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={styles.modalBodyCustom}>
                        {errorMessages.length > 0 && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Loi:</strong>
                                <ul className="mb-0 mt-2">
                                    {errorMessages.map((msg, index) => (
                                        <li key={index}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(modalType === 'add' || modalType === 'edit') && (
                            <Form>
                                {modalType === 'edit' && (
                                    <Form.Control
                                        type="hidden"
                                        value={formData.id || ''}
                                    />
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label>Ten</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        {...(modalType === 'edit' ? { disabled: true } : {})}
                                    />
                                </Form.Group>
                                {modalType === 'add' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mat khau</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label>Gioi tinh</Form.Label>
                                    <Form.Select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as IAdminUserFormData['gender'] })}
                                    >
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nu</option>
                                        <option value="OTHER">Khac</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dia chi</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tuoi</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => {
                                            const value = Number.parseInt(e.target.value, 10);
                                            setFormData({ ...formData, age: Number.isNaN(value) ? '' : value });
                                        }}
                                        min={1}
                                        max={120}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vai tro</Form.Label>
                                    <Form.Select
                                        value={formData.role.id}
                                        onChange={(e) => setFormData({ ...formData, role: { id: Number.parseInt(e.target.value, 10) } })}
                                    >
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        )}
                        {modalType === 'delete' && (
                            <p>Ban co chac chan muon xoa nguoi dung <strong>{selectedUser?.name}</strong>? Hanh dong nay khong the hoan tac.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer className={styles.modalFooterCustom}>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Huy
                        </Button>
                        {(modalType === 'add' || modalType === 'edit') && (
                            <Button variant="primary" onClick={() => void handleSave()}>
                                Luu thay doi
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <Button variant="danger" onClick={() => void handleDelete()}>
                                Xoa
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminUsersSection;
