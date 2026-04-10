import React from 'react';
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
    Pagination
} from 'react-bootstrap';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaShieldAlt,
    FaKey
} from 'react-icons/fa';
import { useRolePermission } from '../../hooks/useRolePermission';
import styles from './scss/AdminRolesPermissionsSection.module.scss';
import type { IPermission, IRole, PermissionMethod, PermissionModule } from '../../types/role';

interface RoleFormData {
    name: string;
    description: string;
    active: boolean;
}

interface PermissionFormData {
    name: string;
    apiPath: string;
    method: PermissionMethod;
    module: PermissionModule;
}

const AdminRolesPermissionsSection = () => {
    const {
        roles,
        permissions,
        filteredPermissions,
        loading,
        showRoleModal,
        setShowRoleModal,
        showPermissionModal,
        setShowPermissionModal,
        showAssignModal,
        setShowAssignModal,
        modalType,
        selectedRole,
        selectedPermission,
        roleFormData,
        setRoleFormData,
        permissionFormData,
        setPermissionFormData,
        selectedPermissionsForRole,
        rolePage,
        setRolePage,
        roleTotalPages,
        filterModule,
        setFilterModule,
        filterMethod,
        setFilterMethod,
        searchName,
        setSearchName,
        handleShowRoleModal,
        handleSaveRole,
        handleDeleteRole,
        handleShowPermissionModal,
        handleSavePermission,
        handleDeletePermission,
        handleShowAssignModal,
        handleTogglePermission,
        handleSaveAssignments
    } = useRolePermission();

    return (
        <div className={styles.adminRolesPermissionsPage}>
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <h2 className={`${styles.textGradient} fw-bold`}>Vai tro va Quyen han</h2>
                        <p className={styles.mutedText}>Quan ly vai tro va quyen han he thong</p>
                    </Col>
                </Row>

                {loading && (
                    <div className="text-center mb-3">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                <Tabs defaultActiveKey="roles" className={`mb-4 ${styles.customTabs}`}>
                    <Tab eventKey="roles" title={<><FaShieldAlt className="me-2" />Roles</>}>
                        <Row className="mb-3">
                            <Col className="text-end">
                                <Button variant="primary" onClick={() => handleShowRoleModal('add')}>
                                    <FaPlus className="me-2" />
                                    Add Role
                                </Button>
                            </Col>
                        </Row>
                        <Card className={styles.tableCard}>
                            <Card.Body>
                                <Table hover variant="dark" className={styles.customTable}>
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
                                        {roles.length > 0 ? (
                                            roles.map((role) => (
                                                <tr key={role.id}>
                                                    <td className="fw-semibold">{role.name}</td>
                                                    <td className={styles.mutedText}>{role.description || 'N/A'}</td>
                                                    <td>
                                                        <Badge bg={role.active ? 'success' : 'secondary'}>
                                                            {role.active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </td>
                                                    <td>{role.permissions?.length || 0} permissions</td>
                                                    <td>
                                                        <div className={styles.actionButtons}>
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
                                                <td colSpan={5} className="text-center text-muted">
                                                    Khong co du lieu
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

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

                    <Tab eventKey="permissions" title={<><FaKey className="me-2" />Permissions</>}>
                        <Card className="mb-3 bg-dark">
                            <Card.Body>
                                <Row className="align-items-end">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Tim kiem theo ten</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhap ten quyen han..."
                                                value={searchName}
                                                onChange={(e) => setSearchName(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Loc theo Module</Form.Label>
                                            <Form.Select value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
                                                <option value="">Tat ca Module</option>
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
                                            <Form.Label>Loc theo Phuong thuc</Form.Label>
                                            <Form.Select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
                                                <option value="">Tat ca Phuong thuc</option>
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
                                            Xoa bo loc
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
                        <Card className={styles.tableCard}>
                            <Card.Body>
                                <Table hover variant="dark" className={styles.customTable}>
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
                                        {filteredPermissions.length > 0 ? (
                                            filteredPermissions.map((permission) => (
                                                <tr key={permission.id}>
                                                    <td className="fw-semibold">{permission.name}</td>
                                                    <td><Badge bg="secondary">{permission.module}</Badge></td>
                                                    <td className={styles.mutedText}><code>{permission.apiPath}</code></td>
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
                                                        <div className={styles.actionButtons}>
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
                                                <td colSpan={5} className="text-center text-muted">
                                                    Khong co du lieu
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>

                <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
                    <Modal.Header closeButton className={styles.modalHeaderCustom}>
                        <Modal.Title>
                            {modalType === 'add' && 'Add New Role'}
                            {modalType === 'edit' && 'Edit Role'}
                            {modalType === 'delete' && 'Delete Role'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={styles.modalBodyCustom}>
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
                                        placeholder="Mo ta vai tro"
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
                    <Modal.Footer className={styles.modalFooterCustom}>
                        <Button variant="secondary" onClick={() => setShowRoleModal(false)} disabled={loading}>
                            Cancel
                        </Button>
                        {(modalType === 'add' || modalType === 'edit') && (
                            <Button variant="primary" onClick={() => void handleSaveRole()} disabled={loading || !roleFormData.name}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <Button variant="danger" onClick={() => void handleDeleteRole()} disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                <Modal show={showPermissionModal} onHide={() => setShowPermissionModal(false)} centered>
                    <Modal.Header closeButton className={styles.modalHeaderCustom}>
                        <Modal.Title>
                            {modalType === 'add' && 'Add New Permission'}
                            {modalType === 'edit' && 'Edit Permission'}
                            {modalType === 'delete' && 'Delete Permission'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={styles.modalBodyCustom}>
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
                                        onChange={(e) => setPermissionFormData({ ...permissionFormData, method: e.target.value as PermissionMethod })}
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
                                        onChange={(e) => setPermissionFormData({ ...permissionFormData, module: e.target.value as PermissionModule })}
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
                                        <option value="ADMINS">ADMINS</option>
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
                    <Modal.Footer className={styles.modalFooterCustom}>
                        <Button variant="secondary" onClick={() => setShowPermissionModal(false)} disabled={loading}>
                            Cancel
                        </Button>
                        {(modalType === 'add' || modalType === 'edit') && (
                            <Button
                                variant="primary"
                                onClick={() => void handleSavePermission()}
                                disabled={loading || !permissionFormData.name || !permissionFormData.apiPath}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
                            </Button>
                        )}
                        {modalType === 'delete' && (
                            <Button variant="danger" onClick={() => void handleDeletePermission()} disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered size="lg">
                    <Modal.Header closeButton className={styles.modalHeaderCustom}>
                        <Modal.Title>Assign Permissions to {selectedRole?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={styles.modalBodyCustom}>
                        <div className={styles.permissionsList}>
                            {permissions.length > 0 ? (
                                permissions.map((permission) => (
                                    <Form.Check
                                        key={permission.id}
                                        type="checkbox"
                                        id={`perm-${permission.id}`}
                                        label={
                                            <div>
                                                <strong>{permission.name}</strong> - {permission.module}
                                                <br />
                                                <small className={styles.mutedText}>
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
                                <p className={styles.mutedText}>Khong co quyen han nao</p>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={styles.modalFooterCustom}>
                        <Button variant="secondary" onClick={() => setShowAssignModal(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => void handleSaveAssignments()} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminRolesPermissionsSection;
