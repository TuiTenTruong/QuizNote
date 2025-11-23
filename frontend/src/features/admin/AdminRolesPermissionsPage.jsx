import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Form,
    Modal,
    Badge,
    Tabs,
    Tab,
    Spinner,
    Alert,
    Pagination
} from 'react-bootstrap';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaShieldAlt,
    FaKey
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
    getRolesPaginated,
    createRole,
    updateRole,
    deleteRole,
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission
} from '../../services/apiService';
import './AdminRolesPermissionsPage.scss';

const AdminRolesPermissionsPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add', 'edit', 'delete'
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [roleFormData, setRoleFormData] = useState({ name: '', description: '', active: true });
    const [permissionFormData, setPermissionFormData] = useState({ name: '', apiPath: '', method: 'GET', module: 'USER' });
    const [selectedPermissionsForRole, setSelectedPermissionsForRole] = useState([]);
    const [rolePage, setRolePage] = useState(0);
    const [roleTotalPages, setRoleTotalPages] = useState(0);

    // Filter states
    const [filterModule, setFilterModule] = useState('');
    const [filterMethod, setFilterMethod] = useState('');
    const [searchName, setSearchName] = useState('');

    // Fetch data on component mount
    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, [rolePage]);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await getRolesPaginated(rolePage, 10);
            if (response && response.data && response.data.result) {
                setRoles(response.data.result || []);
                setRoleTotalPages(response.data.meta.pages || 0);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Không thể tải danh sách vai trò');
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await getAllPermissions(0, 100);
            if (response && response.data && response.data.result) {
                setPermissions(response.data.result || []);
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Không thể tải danh sách quyền hạn');
        }
    };

    // Role handlers
    const handleShowRoleModal = (type, role = null) => {
        setModalType(type);
        setSelectedRole(role);
        if (type === 'edit' && role) {
            setRoleFormData({
                name: role.name,
                description: role.description || '',
                active: role.active !== undefined ? role.active : true
            });
        } else {
            setRoleFormData({ name: '', description: '', active: true });
        }
        setShowRoleModal(true);
    };

    const handleSaveRole = async () => {
        try {
            setLoading(true);
            if (modalType === 'add') {
                const response = await createRole(roleFormData);
                if (response && response.data) {
                    toast.success('Tạo vai trò thành công');
                    fetchRoles();
                }
            } else if (modalType === 'edit') {
                const updateData = { ...roleFormData, id: selectedRole.id };
                const response = await updateRole(updateData);
                if (response && response.data) {
                    toast.success('Cập nhật vai trò thành công');
                    fetchRoles();
                }
            }
            setShowRoleModal(false);
        } catch (error) {
            console.error('Error saving role:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async () => {
        try {
            setLoading(true);
            const response = await deleteRole(selectedRole.id);
            if (response) {
                toast.success('Xóa vai trò thành công');
                fetchRoles();
            }
            setShowRoleModal(false);
        } catch (error) {
            console.error('Error deleting role:', error);
            const errorMsg = error.response?.data?.message || 'Không thể xóa vai trò';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Permission handlers
    const handleShowPermissionModal = (type, permission = null) => {
        setModalType(type);
        setSelectedPermission(permission);
        if (type === 'edit' && permission) {
            setPermissionFormData({
                name: permission.name,
                apiPath: permission.apiPath || '',
                method: permission.method || 'GET',
                module: permission.module
            });
        } else {
            setPermissionFormData({ name: '', apiPath: '', method: 'GET', module: 'USER' });
        }
        setShowPermissionModal(true);
    };

    const handleSavePermission = async () => {
        try {
            setLoading(true);
            if (modalType === 'add') {
                const response = await createPermission(permissionFormData);
                if (response && response.data) {
                    toast.success('Tạo quyền hạn thành công');
                    fetchPermissions();
                }
            } else if (modalType === 'edit') {
                const updateData = { ...permissionFormData, id: selectedPermission.id };
                const response = await updatePermission(updateData);
                if (response && response.data) {
                    toast.success('Cập nhật quyền hạn thành công');
                    fetchPermissions();
                }
            }
            setShowPermissionModal(false);
        } catch (error) {
            console.error('Error saving permission:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePermission = async () => {
        try {
            setLoading(true);
            const response = await deletePermission(selectedPermission.id);
            if (response) {
                toast.success('Xóa quyền hạn thành công');
                fetchPermissions();
                fetchRoles(); // Refresh roles as permissions might be removed from roles
            }
            setShowPermissionModal(false);
        } catch (error) {
            console.error('Error deleting permission:', error);
            const errorMsg = error.response?.data?.message || 'Không thể xóa quyền hạn';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Assign permissions to role
    const handleShowAssignModal = (role) => {
        setSelectedRole(role);
        // Extract permission IDs from role's permissions array
        const permissionIds = role.permissions ? role.permissions.map(p => p.id) : [];
        setSelectedPermissionsForRole(permissionIds);
        setShowAssignModal(true);
    };

    const handleTogglePermission = (permId) => {
        if (selectedPermissionsForRole.includes(permId)) {
            setSelectedPermissionsForRole(selectedPermissionsForRole.filter(p => p !== permId));
        } else {
            setSelectedPermissionsForRole([...selectedPermissionsForRole, permId]);
        }
    };

    // Filter permissions based on filters
    const filteredPermissions = permissions.filter(permission => {
        const matchesModule = !filterModule || permission.module === filterModule;
        const matchesMethod = !filterMethod || permission.method === filterMethod;
        const matchesName = !searchName || permission.name.toLowerCase().includes(searchName.toLowerCase());
        return matchesModule && matchesMethod && matchesName;
    });

    const handleSaveAssignments = async () => {
        try {
            setLoading(true);
            // Get selected permission objects
            const selectedPermissionsObjects = permissions.filter(p =>
                selectedPermissionsForRole.includes(p.id)
            );

            const updateData = {
                id: selectedRole.id,
                name: selectedRole.name,
                description: selectedRole.description,
                active: selectedRole.active,
                permissions: selectedPermissionsObjects
            };

            const response = await updateRole(updateData);
            if (response && response.data) {
                toast.success('Cập nhật quyền hạn cho vai trò thành công');
                fetchRoles();
            }
            setShowAssignModal(false);
        } catch (error) {
            console.error('Error assigning permissions:', error);
            const errorMsg = error.response?.data?.message || 'Không thể cập nhật quyền hạn';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-roles-permissions-page">
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <h2 className="text-gradient fw-bold">Vai trò & Quyền hạn</h2>
                        <p className="text-muted">Quản lý vai trò và quyền hạn hệ thống</p>
                    </Col>
                </Row>

                {loading && (
                    <div className="text-center mb-3">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                <Tabs defaultActiveKey="roles" className="mb-4 custom-tabs">
                    {/* Roles Tab */}
                    <Tab eventKey="roles" title={<><FaShieldAlt className="me-2" />Roles</>}>
                        <Row className="mb-3">
                            <Col className="text-end">
                                <Button variant="primary" onClick={() => handleShowRoleModal('add')}>
                                    <FaPlus className="me-2" />
                                    Add Role
                                </Button>
                            </Col>
                        </Row>
                        <Card className="table-card">
                            <Card.Body>
                                <Table hover variant="dark" className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Role Name</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Permissions</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles && roles.length > 0 ? (
                                            roles.map((role) => (
                                                <tr key={role.id}>
                                                    <td className="fw-semibold">
                                                        {role.name}
                                                    </td>
                                                    <td className="text-muted">{role.description || 'N/A'}</td>
                                                    <td>
                                                        <Badge bg={role.active ? 'success' : 'secondary'}>
                                                            {role.active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </td>
                                                    <td>

                                                        {role.permissions?.length || 0} permissions

                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Button
                                                                variant="outline-warning"
                                                                size="sm"
                                                                onClick={() => handleShowAssignModal(role)}
                                                                title="Assign permissions"
                                                            >
                                                                <FaKey />
                                                            </Button>
                                                            <Button
                                                                variant="outline-info"
                                                                size="sm"
                                                                onClick={() => handleShowRoleModal('edit', role)}
                                                                title="Edit role"
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleShowRoleModal('delete', role)}
                                                                title="Delete role"
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">
                                                    Không có dữ liệu
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        {/* Pagination for Roles */}
                        {roleTotalPages > 1 && (
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination>
                                    <Pagination.Prev
                                        disabled={rolePage === 0}
                                        onClick={() => setRolePage(rolePage - 1)}
                                    />
                                    {[...Array(roleTotalPages)].map((_, index) => (
                                        <Pagination.Item
                                            key={index}
                                            active={index === rolePage}
                                            onClick={() => setRolePage(index)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        disabled={rolePage === roleTotalPages - 1}
                                        onClick={() => setRolePage(rolePage + 1)}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </Tab>

                    {/* Permissions Tab */}
                    <Tab eventKey="permissions" title={<><FaKey className="me-2" />Permissions</>}>
                        {/* Filter Section */}
                        <Card className="mb-3 bg-dark">
                            <Card.Body>
                                <Row className="align-items-end">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Tìm kiếm theo tên</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập tên quyền hạn..."
                                                value={searchName}
                                                onChange={(e) => setSearchName(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Lọc theo Module</Form.Label>
                                            <Form.Select
                                                value={filterModule}
                                                onChange={(e) => setFilterModule(e.target.value)}
                                            >
                                                <option value="">Tất cả Module</option>
                                                <option value="USERS">USERS</option>
                                                <option value="SUBJECTS">SUBJECTS</option>
                                                <option value="ORDERS">ORDERS</option>
                                                <option value="ROLES">ROLES</option>
                                                <option value="PERMISSIONS">PERMISSIONS</option>
                                                <option value="PURCHASES">PURCHASES</option>
                                                <option value="COMMENTS">COMMENTS</option>
                                                <option value="CHAPTERS">CHAPTERS</option>
                                                <option value="FILES">FILES</option>
                                                <option value="SUBMISSIONS">SUBMISSIONS</option>
                                                <option value="PAYMENTS">PAYMENTS</option>
                                                <option value="WEEKLY_QUIZZES">WEEKLY_QUIZZES</option>
                                                <option value="SELLERS">SELLERS</option>
                                                <option value="ADMINS">ADMINS</option>
                                                <option value="WITHDRAWS">WITHDRAWS</option>
                                                <option value="REWARDS">REWARDS</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Lọc theo Phương thức</Form.Label>
                                            <Form.Select
                                                value={filterMethod}
                                                onChange={(e) => setFilterMethod(e.target.value)}
                                            >
                                                <option value="">Tất cả Phương thức</option>
                                                <option value="GET">GET</option>
                                                <option value="POST">POST</option>
                                                <option value="PUT">PUT</option>
                                                <option value="DELETE">DELETE</option>
                                                <option value="PATCH">PATCH</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Button
                                            variant="outline-secondary"
                                            className="w-100"
                                            onClick={() => {
                                                setSearchName('');
                                                setFilterModule('');
                                                setFilterMethod('');
                                            }}
                                        >
                                            Xóa bộ lọc
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Row className="mb-3">
                            <Col className="text-end">
                                <Button variant="primary" onClick={() => handleShowPermissionModal('add')}>
                                    <FaPlus className="me-2" />
                                    Add Permission
                                </Button>
                            </Col>
                        </Row>
                        <Card className="table-card">
                            <Card.Body>
                                <Table hover variant="dark" className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Permission Name</th>
                                            <th>Module</th>
                                            <th>API Path</th>
                                            <th>Method</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPermissions && filteredPermissions.length > 0 ? (
                                            filteredPermissions.map((permission) => (
                                                <tr key={permission.id}>
                                                    <td className="fw-semibold">{permission.name}</td>
                                                    <td>
                                                        <Badge bg="secondary">{permission.module}</Badge>
                                                    </td>
                                                    <td className="text-muted">
                                                        <code>{permission.apiPath}</code>
                                                    </td>
                                                    <td>
                                                        <Badge
                                                            bg={
                                                                permission.method === 'GET' ? 'success' :
                                                                    permission.method === 'POST' ? 'primary' :
                                                                        permission.method === 'PUT' ? 'warning' :
                                                                            'danger'
                                                            }
                                                        >
                                                            {permission.method}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Button
                                                                variant="outline-info"
                                                                size="sm"
                                                                onClick={() => handleShowPermissionModal('edit', permission)}
                                                                title="Edit permission"
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleShowPermissionModal('delete', permission)}
                                                                title="Delete permission"
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">
                                                    Không có dữ liệu
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>

                {/* Role Modal */}
                <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            {modalType === 'add' && 'Add New Role'}
                            {modalType === 'edit' && 'Edit Role'}
                            {modalType === 'delete' && 'Delete Role'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        {(modalType === 'add' || modalType === 'edit') && (
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Role Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={roleFormData.name}
                                        onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                                        placeholder="e.g., ADMIN, SELLER, STUDENT"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={roleFormData.description}
                                        onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                                        placeholder="Mô tả vai trò"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Active"
                                        checked={roleFormData.active}
                                        onChange={(e) => setRoleFormData({ ...roleFormData, active: e.target.checked })}
                                    />
                                </Form.Group>
                            </Form>
                        )}
                        {modalType === 'delete' && (
                            <p>Are you sure you want to delete role <strong>{selectedRole?.name}</strong>?</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={() => setShowRoleModal(false)} disabled={loading}>
                            Cancel
                        </Button>
                        {(modalType === 'add' || modalType === 'edit') && (
                            <Button variant="primary" onClick={handleSaveRole} disabled={loading || !roleFormData.name}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <Button variant="danger" onClick={handleDeleteRole} disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                {/* Permission Modal */}
                <Modal show={showPermissionModal} onHide={() => setShowPermissionModal(false)} centered>
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>
                            {modalType === 'add' && 'Add New Permission'}
                            {modalType === 'edit' && 'Edit Permission'}
                            {modalType === 'delete' && 'Delete Permission'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        {(modalType === 'add' || modalType === 'edit') && (
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Permission Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={permissionFormData.name}
                                        onChange={(e) => setPermissionFormData({ ...permissionFormData, name: e.target.value })}
                                        placeholder="e.g., USER_READ, SUBJECT_CREATE"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>API Path *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={permissionFormData.apiPath}
                                        onChange={(e) => setPermissionFormData({ ...permissionFormData, apiPath: e.target.value })}
                                        placeholder="e.g., /api/v1/users"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Method *</Form.Label>
                                    <Form.Select
                                        value={permissionFormData.method}
                                        onChange={(e) => setPermissionFormData({ ...permissionFormData, method: e.target.value })}
                                        required
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                        <option value="PATCH">PATCH</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Module *</Form.Label>
                                    <Form.Select
                                        value={permissionFormData.module}
                                        onChange={(e) => setPermissionFormData({ ...permissionFormData, module: e.target.value })}
                                        required
                                    >
                                        <option value="USERS">USERS</option>
                                        <option value="SUBJECTS">SUBJECTS</option>
                                        <option value="ORDERS">ORDERS</option>
                                        <option value="ROLES">ROLES</option>
                                        <option value="PERMISSIONS">PERMISSIONS</option>
                                        <option value="PURCHASES">PURCHASES</option>
                                        <option value="COMMENTS">COMMENTS</option>
                                        <option value="CHAPTERS">CHAPTERS</option>
                                        <option value="FILES">FILES</option>
                                        <option value="SUBMISSIONS">SUBMISSIONS</option>
                                        <option value="PAYMENTS">PAYMENTS</option>
                                        <option value="WEEKLY_QUIZZES">WEEKLY_QUIZZES</option>
                                        <option value="SELLERS">SELLERS</option>
                                        <option value="PAYMENTS">PAYMENTS</option>
                                        <option value="ADMINS">ADMINS</option>
                                        <option value="ORDERS">ORDERS</option>
                                        <option value="WITHDRAWS">WITHDRAWS</option>
                                        <option value="REWARDS">REWARDS</option>
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        )}
                        {modalType === 'delete' && (
                            <p>Are you sure you want to delete permission <strong>{selectedPermission?.name}</strong>?</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={() => setShowPermissionModal(false)} disabled={loading}>
                            Cancel
                        </Button>
                        {(modalType === 'add' || modalType === 'edit') && (
                            <Button
                                variant="primary"
                                onClick={handleSavePermission}
                                disabled={loading || !permissionFormData.name || !permissionFormData.apiPath || !permissionFormData.method || !permissionFormData.module}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <Button variant="danger" onClick={handleDeletePermission} disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                {/* Assign Permissions Modal */}
                <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered size="lg">
                    <Modal.Header closeButton className="modal-header-custom">
                        <Modal.Title>Assign Permissions to {selectedRole?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body-custom">
                        <div className="permissions-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {permissions && permissions.length > 0 ? (
                                permissions.map((permission) => (
                                    <Form.Check
                                        key={permission.id}
                                        type="checkbox"
                                        id={`perm-${permission.id}`}
                                        label={
                                            <div>
                                                <strong>{permission.name}</strong> - {permission.module}
                                                <br />
                                                <small className="text-muted">
                                                    {permission.method} {permission.apiPath}
                                                </small>
                                            </div>
                                        }
                                        checked={selectedPermissionsForRole.includes(permission.id)}
                                        onChange={() => handleTogglePermission(permission.id)}
                                        className="mb-3"
                                    />
                                ))
                            ) : (
                                <p className="text-muted">Không có quyền hạn nào</p>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer-custom">
                        <Button variant="secondary" onClick={() => setShowAssignModal(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveAssignments} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminRolesPermissionsPage;
