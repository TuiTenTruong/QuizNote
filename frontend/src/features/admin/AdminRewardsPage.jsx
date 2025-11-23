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
    Spinner,
    Alert
} from 'react-bootstrap';
import {
    FaSearch,
    FaPlus,
    FaEdit,
    FaTrash,
    FaGift,
    FaCoins,
    FaBoxOpen,
    FaTimes
} from 'react-icons/fa';
import './AdminRewardsPage.scss';
import {
    getAllRewards,
    createReward,
    updateReward,
    deleteReward
} from '../../services/apiService';
import axiosInstance from "../../utils/axiosCustomize";
import { useNavigate } from 'react-router-dom';
const AdminRewardsPage = () => {
    const [rewards, setRewards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedReward, setSelectedReward] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/rewards/";
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cost: '',
        stockQuantity: '',
        inStock: true,
        active: true
    });

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            const response = await getAllRewards(0, 100);
            if (response && response.data) {
                setRewards(response.data.result || []);
            }
        } catch (error) {
            console.error('Failed to fetch rewards:', error);
            showAlert('danger', 'Không thể tải danh sách quà tặng');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type, text) => {
        setAlert({ type, text });
        setTimeout(() => setAlert(null), 5000);
    };

    const filteredRewards = rewards.filter(reward => {
        const matchSearch =
            reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reward.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus =
            filterStatus === 'All' ||
            (filterStatus === 'Active' && reward.isActive) ||
            (filterStatus === 'Inactive' && !reward.isActive) ||
            (filterStatus === 'InStock' && reward.inStock) ||
            (filterStatus === 'OutOfStock' && !reward.inStock);
        return matchSearch && matchStatus;
    });

    const handleShowModal = (type, reward = null) => {
        setModalType(type);
        setSelectedReward(reward);
        if (type === 'create') {
            setFormData({
                name: '',
                description: '',
                cost: '',
                stockQuantity: '',
                inStock: true,
                active: true
            });
            setImageFile(null);
            setPreviewUrl('');
        } else if (type === 'edit' && reward) {
            setFormData({
                name: reward.name,
                description: reward.description || '',
                cost: reward.cost,
                stockQuantity: reward.stockQuantity,
                inStock: reward.inStock,
                active: reward.active
            });
            setImageFile(null);
            setPreviewUrl(reward.imageUrl || '');
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReward(null);
        setImageFile(null);
        setPreviewUrl('');
        setFormData({
            name: '',
            description: '',
            cost: '',
            stockQuantity: '',
            inStock: true,
            active: true
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };

        if (name === 'stockQuantity' && parseInt(value) === 0) {
            newFormData.inStock = false;
        }

        setFormData(newFormData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setPreviewUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            const rewardData = {
                name: formData.name,
                description: formData.description,
                cost: parseInt(formData.cost),
                stockQuantity: parseInt(formData.stockQuantity),
                inStock: formData.inStock,
                active: formData.active
            };

            formDataToSend.append('reward', new Blob([JSON.stringify(rewardData)], {
                type: 'application/json'
            }));

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            let response;
            if (modalType === 'create') {
                response = await createReward(formDataToSend);
                showAlert('success', 'Tạo quà tặng thành công!');
            } else if (modalType === 'edit') {
                response = await updateReward(selectedReward.id, formDataToSend);
                showAlert('success', 'Cập nhật quà tặng thành công!');
            }

            if (response) {
                await fetchRewards();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error submitting reward:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
            showAlert('danger', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await deleteReward(selectedReward.id);
            if (response) {
                showAlert('success', 'Xóa quà tặng thành công!');
                await fetchRewards();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error deleting reward:', error);
            const errorMsg = error.response?.data?.message || 'Không thể xóa quà tặng.';
            showAlert('danger', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (reward) => {
        if (!reward.active) {
            return <Badge bg="secondary">Ngừng hoạt động</Badge>;
        }
        if (!reward.inStock) {
            return <Badge bg="danger">Hết hàng</Badge>;
        }
        return <Badge bg="success">Đang bán</Badge>;
    };

    return (
        <div className="admin-rewards-page">
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <h2 className="fw-bold mb-1 text-gradient">
                            Quản lý Quà Tặng
                        </h2>
                        <p className="text-muted mb-0">
                            Quản lý các quà tặng được đổi bằng xu từ Weekly Quiz.
                        </p>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                        <Button
                            className="btn-gradient"
                            onClick={() => handleShowModal('create')}
                        >
                            <FaPlus className="me-2" />
                            Tạo quà tặng mới
                        </Button>
                        <Button className="btn-outline-gradient ms-2" onClick={() => navigate('/admin/rewards/transactions')}>
                            Xem giao dịch
                        </Button>
                    </Col>
                </Row>

                {alert && (
                    <Alert
                        variant={alert.type}
                        onClose={() => setAlert(null)}
                        dismissible
                        className="mb-3"
                    >
                        {alert.text}
                    </Alert>
                )}

                <Card className="bg-dark text-light border-0 shadow-sm rewards-table-card">
                    <Card.Body>
                        <Row className="mb-3 g-3">
                            <Col md={6}>
                                <InputGroup className="search-group">
                                    <InputGroup.Text className="bg-input border-0 text-secondary">
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm theo tên hoặc mô tả..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-input border-0 text-light"
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="bg-input border-0 text-light"
                                >
                                    <option value="All">Tất cả trạng thái</option>
                                    <option value="Active">Đang hoạt động</option>
                                    <option value="Inactive">Ngừng hoạt động</option>
                                    <option value="InStock">Còn hàng</option>
                                    <option value="OutOfStock">Hết hàng</option>
                                </Form.Select>
                            </Col>
                            <Col md={3} className="text-md-end text-secondary d-flex align-items-center justify-content-md-end">
                                Tổng: <span className="fw-semibold ms-1">{filteredRewards.length}</span> quà tặng
                            </Col>
                        </Row>

                        {loading && !showModal ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="light" />
                                <div className="mt-3 text-secondary">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="align-middle rewards-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Hình ảnh</th>
                                            <th>Tên quà</th>
                                            <th>Mô tả</th>
                                            <th>Giá xu</th>
                                            <th>Tồn kho</th>
                                            <th>Trạng thái</th>
                                            <th className="text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRewards.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4">
                                                    <FaBoxOpen size={40} className="text-muted mb-2" />
                                                    <div className="text-secondary">
                                                        Không tìm thấy quà tặng nào
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRewards.map((reward) => (
                                                <tr key={reward.id}>
                                                    <td className="text-secondary">#{reward.id}</td>
                                                    <td>
                                                        {reward.imageUrl ? (
                                                            <img
                                                                src={backendBaseURL + reward.imageUrl}
                                                                alt={reward.name}
                                                                className="reward-thumb"
                                                            />
                                                        ) : (
                                                            <div className="reward-thumb placeholder">
                                                                <FaGift className="text-muted" />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className='text-muted'>
                                                        <strong>{reward.name}</strong>
                                                    </td>
                                                    <td>
                                                        <div
                                                            className="text-muted"
                                                            style={{ maxWidth: 260 }}
                                                            title={reward.description}
                                                        >
                                                            {reward.description || '-'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Badge bg="warning" text="dark" className="fs-6 px-3 py-1">
                                                            <FaCoins className="me-1" />
                                                            {reward.cost}
                                                        </Badge>
                                                    </td>
                                                    <td className='text-muted'>{reward.stockQuantity}</td>
                                                    <td>{getStatusBadge(reward)}</td>
                                                    <td className="text-center">
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleShowModal('edit', reward)}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleShowModal('delete', reward)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <Modal
                show={showModal && (modalType === 'create' || modalType === 'edit')}
                onHide={handleCloseModal}
                size="lg"
                centered
                className="reward-edit-modal"
            >
                <Modal.Header closeButton className="bg-dark text-light border-0">
                    <Modal.Title>
                        {modalType === 'create' ? 'Tạo quà tặng mới' : 'Chỉnh sửa quà tặng'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="bg-dark text-light">
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Tên quà tặng *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="VD: Voucher Momo 50k"
                                        className="bg-dark text-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Mô tả chi tiết về quà tặng..."
                                        className="bg-dark text-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Hình ảnh</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="bg-dark text-light"
                                    />
                                    {previewUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="reward-preview"
                                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Giá xu *</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-dark border-1 text-warning">
                                            <FaCoins />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="cost"
                                            value={formData.cost}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            placeholder="100"
                                            className="bg-dark text-light border-1"
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Số lượng tồn kho *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        placeholder="100"
                                        className="bg-dark text-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Check
                                        type="checkbox"
                                        name="inStock"
                                        label="Còn hàng (có thể đổi)"
                                        checked={formData.inStock}
                                        onChange={handleInputChange}
                                        className="text-secondary"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Trạng thái sản phẩm *</Form.Label>
                                    <Form.Select
                                        name="active"
                                        value={formData.active}
                                        onChange={handleInputChange}
                                        className="bg-dark text-light"
                                    >
                                        <option value={true}>Đang hoạt động</option>
                                        <option value={false}>Ngừng hoạt động</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="bg-dark border-0">
                        <Button variant="outline-secondary" onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            className="btn-gradient"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        className="me-2"
                                    />
                                    Đang xử lý...
                                </>
                            ) : modalType === 'create' ? (
                                'Tạo mới'
                            ) : (
                                'Cập nhật'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showModal && modalType === 'delete'}
                onHide={handleCloseModal}
                centered
                className="reward-delete-modal"
            >
                <Modal.Header closeButton className="bg-dark text-light border-0">
                    <Modal.Title>
                        <FaTimes className="me-2 text-danger" />
                        Xác nhận xóa
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    <p>
                        Bạn có chắc chắn muốn xóa quà tặng{' '}
                        <strong>{selectedReward?.name}</strong> không?
                    </p>
                    <p className="text-danger mb-0">
                        <small>Hành động này không thể hoàn tác!</small>
                    </p>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-0">
                    <Button variant="outline-secondary" onClick={handleCloseModal}>
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                Đang xóa...
                            </>
                        ) : (
                            'Xóa'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminRewardsPage;
