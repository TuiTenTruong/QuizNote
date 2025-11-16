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
import './AdminUsersPage.scss';
import { GetAllUsers, CreateUser, UpdateUser, DeleteUser } from '../../services/apiService';
import { getAllRoles } from '../../services/apiService';
import { toast } from "react-toastify";
import { changeStatusUser } from '../../services/apiService';
const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        gender: 'MALE',
        address: '',
        age: '',
        role: { id: 3 } // Default to Student (role id 3)
    });
    const [roles, setRoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await getAllRoles();
            setRoles(response.data.result);
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await GetAllUsers(currentPage - 1);
            setUsers(response.data.result);
            setMeta(response.data.meta);
        }
        fetchUsers();
    }, [currentPage]);

    const filteredUsers = users?.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRole = filterRole === 'All' || user.role?.name === filterRole;
        const matchStatus = filterStatus === 'All' || (filterStatus === 'Active' && user.active) || (filterStatus === 'Inactive' && !user.active);
        return matchSearch && matchRole && matchStatus;
    });



    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleShowModal = (type, user = null) => {
        setModalType(type);
        setSelectedUser(user);
        setErrorMessages([]); // Clear error messages when opening modal
        if (type === 'edit' && user) {
            setFormData({
                id: user.id,
                name: user.name,
                email: user.email,
                password: '', // Don't show password
                gender: user.gender || 'MALE',
                address: user.address || '',
                age: user.age || '',
                role: { id: user.role?.id || 3 }
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                gender: 'MALE',
                address: '',
                age: '',
                role: { id: 3 }
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setErrorMessages([]); // Clear error messages when closing modal
        setFormData({
            name: '',
            email: '',
            password: '',
            gender: 'MALE',
            address: '',
            age: '',
            role: { id: 3 }
        });
    };

    const handleSave = async () => {
        try {
            setErrorMessages([]); // Clear previous errors

            if (modalType === 'add') {
                const response = await CreateUser(formData);

                if (response.statusCode !== 201 && response.statusCode !== 200) {
                    // Handle error response
                    if (Array.isArray(response.message)) {
                        setErrorMessages(response.message);
                    } else {
                        setErrorMessages([response.message || 'Có lỗi xảy ra khi tạo người dùng']);
                    }
                    toast.error('Không thể tạo người dùng. Vui lòng kiểm tra lại thông tin.');
                    return; // Don't close modal on error
                }

                toast.success('Tạo người dùng thành công');
                // Refresh the user list
                const usersResponse = await GetAllUsers(currentPage - 1);
                setUsers(usersResponse.data.result);
                setMeta(usersResponse.data.meta);
                handleCloseModal();

            } else if (modalType === 'edit') {
                // For update, don't send password if it's empty
                const updateData = { ...formData };

                const response = await UpdateUser(selectedUser.id, updateData);

                if (response.statusCode !== 200 && response.statusCode !== 201) {
                    // Handle error response
                    if (Array.isArray(response.message)) {
                        setErrorMessages(response.message);
                    } else {
                        setErrorMessages([response.message || 'Có lỗi xảy ra khi cập nhật người dùng']);
                    }
                    toast.error('Không thể cập nhật người dùng. Vui lòng kiểm tra lại thông tin.');
                    return; // Don't close modal on error
                }

                toast.success('Cập nhật người dùng thành công');
                // Refresh the user list
                const usersResponse = await GetAllUsers(currentPage - 1);
                setUsers(usersResponse.data.result);
                setMeta(usersResponse.data.meta);
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving user:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu người dùng';

            if (Array.isArray(errorMsg)) {
                setErrorMessages(errorMsg);
            } else {
                setErrorMessages([errorMsg]);
            }

            toast.error('Có lỗi xảy ra khi lưu người dùng');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await DeleteUser(selectedUser.id);

            if (response.statusCode !== 200 && response.statusCode !== 204) {
                toast.error(response.message || 'Có lỗi xảy ra khi xóa người dùng');
                return;
            }

            toast.success('Xóa người dùng thành công');
            // Refresh the user list
            const usersResponse = await GetAllUsers(currentPage - 1);
            setUsers(usersResponse.data.result);
            setMeta(usersResponse.data.meta);
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Có lỗi xảy ra khi xóa người dùng');
        }
    };

    const handleToggleBan = async (user) => {
        const newStatus = !user.active;
        const response = await changeStatusUser(user.id, newStatus)
        console.log(response);
        if (response.statusCode === 200 || response.statusCode === 201) {
            setUsers(users.map(u =>
                u.id === user.id ? { ...u, active: newStatus } : u
            ));
            toast.success(`Người dùng đã được ${newStatus ? 'mở khóa' : 'khóa'} thành công`);
        } else {
            toast.error('Có lỗi xảy ra khi thay đổi trạng thái người dùng');
        }
    };

    return (
        <div className="admin-users-page">
            <Container fluid>
                {/* Header */}
                <Row className="mb-4">
                    <Col>
                        <h2 className="text-gradient fw-bold">Quản trị người dùng</h2>
                        <p className="text-muted">Quản lý tất cả người dùng, vai trò và quyền hạn</p>
                    </Col>
                </Row>

                {/* Filters & Search */}
                <Row className="mb-4">
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text><FaSearch /></InputGroup.Text>
                            <Form.Control
                                placeholder="Tìm kiếm theo tên hoặc email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                            <option value="All">Tất cả vai trò</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Select>
                    </Col>
                    <Col md={2} className="text-end">
                        <Button variant="primary" onClick={() => handleShowModal('add')}>
                            <FaUserPlus className="me-2" />
                            Thêm người dùng
                        </Button>
                    </Col>
                </Row>

                {/* Users Table */}
                <Row>
                    <Col>
                        <Card className="users-table-card">
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table hover variant="dark" className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Tên</th>
                                                <th>Email</th>
                                                <th>Vai trò</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày tham gia</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers && filteredUsers.length > 0 ? (
                                                filteredUsers.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="fw-semibold">{user.name}</td>
                                                        <td className="text-muted">{user.email}</td>
                                                        <td>
                                                            <Badge bg={
                                                                user.role.name === 'SUPER_ADMIN' ? 'danger' :
                                                                    user.role.name === 'Seller' ? 'warning' :
                                                                        'info'
                                                            }>
                                                                {user.role.name}
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
                                                    <td colSpan="6" className="text-center text-muted">
                                                        Không có dữ liệu người dùng
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {meta.pages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <div className="text-muted">
                                            Trang {meta.page} / {meta.pages} - Tổng số {meta.total} người dùng
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
                                                // Show first page, last page, current page, and pages around current
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
                                                } else if (
                                                    pageNumber === meta.page - 2 ||
                                                    pageNumber === meta.page + 2
                                                ) {
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


                {/* Modal */}
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            {modalType === 'add' && 'Thêm người dùng mới'}
                            {modalType === 'edit' && 'Chỉnh sửa người dùng'}
                            {modalType === 'delete' && 'Xóa người dùng'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        {/* Display error messages */}
                        {errorMessages.length > 0 && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Lỗi:</strong>
                                <ul className="mb-0 mt-2">
                                    {errorMessages.map((msg, index) => (
                                        <li key={index}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(modalType === 'add' || modalType === 'edit') && (
                            <Form>
                                {modalType === 'edit' &&
                                    <Form.Control
                                        type="hidden"
                                        value={formData.id}
                                    />
                                }
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên</Form.Label>
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
                                        <Form.Label>Mật khẩu</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label>Giới tính</Form.Label>
                                    <Form.Select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tuổi</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || '' })}
                                        min="1"
                                        max="120"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vai trò</Form.Label>
                                    <Form.Select
                                        value={formData.role.id}
                                        onChange={(e) => setFormData({ ...formData, role: { id: parseInt(e.target.value) } })}
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        )}
                        {modalType === 'delete' && (
                            <p>Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.name}</strong>? Hành động này không thể hoàn tác.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        {(modalType === 'add' || modalType === 'edit') && (
                            <Button variant="primary" onClick={handleSave}>
                                Lưu thay đổi
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <Button variant="danger" onClick={handleDelete}>
                                Xóa
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminUsersPage;
