import React, { useCallback } from 'react';
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
    Spinner
} from 'react-bootstrap';
import {
    FaSearch,
    FaPlus,
    FaEdit,
    FaTrash,
    FaGift,
    FaCoins,
    FaBoxOpen
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    useRewardActions,
    useRewardFilter,
    useRewardFormState,
    useRewardModalState,
    useRewardQuery
} from '../../hooks/useReward';
import axiosInstance from '../../utils/axiosCustomize';
import styles from './scss/AdminRewardsSection.module.scss';
import type { IReward, RewardFilterStatus, RewardModalType } from '../../types/reward';

const getRewardActive = (reward: IReward): boolean => {
    return reward.isActive ?? reward.active ?? true;
};

const getStatusBadge = (reward: IReward) => {
    const rewardActive = getRewardActive(reward);

    if (!rewardActive) {
        return <Badge bg="secondary">Ngung hoat dong</Badge>;
    }

    if (!reward.inStock) {
        return <Badge bg="danger">Het hang</Badge>;
    }

    return <Badge bg="success">Dang ban</Badge>;
};

const AdminRewardsSection = () => {
    const navigate = useNavigate();
    const backendBaseURL = `${axiosInstance.defaults.baseURL}storage/rewards/`;

    const { rewards, loading, setLoading, fetchRewards } = useRewardQuery();
    const { searchTerm, setSearchTerm, filterStatus, setFilterStatus, filteredRewards } = useRewardFilter(rewards);
    const { showModal, modalType, selectedReward, openModal, closeModal } = useRewardModalState();

    const {
        imageFile,
        previewUrl,
        formData,
        resetForm,
        handleShowModal,
        handleInputChange,
        handleFileChange
    } = useRewardFormState();

    const handleShowRewardModal = useCallback((type: RewardModalType, reward: IReward | null = null) => {
        openModal(type, reward);
        handleShowModal(type, reward);
    }, [handleShowModal, openModal]);

    const handleCloseRewardModal = useCallback(() => {
        closeModal();
        resetForm();
    }, [closeModal, resetForm]);

    const { handleSubmit, handleDelete } = useRewardActions(
        modalType,
        selectedReward,
        formData,
        imageFile,
        setLoading,
        fetchRewards,
        handleCloseRewardModal
    );

    return (
        <div className={styles.adminRewardsPage}>
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <h2 className={`fw-bold mb-1 ${styles.textGradient}`}>Quan ly Qua Tang</h2>
                        <p className={`${styles.mutedText} mb-0`}>Quan ly cac qua tang duoc doi bang xu tu Weekly Quiz.</p>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                        <Button className={styles.btnGradient} onClick={() => handleShowRewardModal('create')}>
                            <FaPlus className="me-2" />
                            Tao qua tang moi
                        </Button>
                        <Button className={styles.btnOutlineGradient} onClick={() => navigate('/admin/rewards/transactions')}>
                            Xem giao dich
                        </Button>
                    </Col>
                </Row>

                <Card className={`bg-dark text-light border-0 shadow-sm ${styles.rewardsTableCard}`}>
                    <Card.Body>
                        <Row className="mb-3 g-3">
                            <Col md={6}>
                                <InputGroup className={styles.searchGroup}>
                                    <InputGroup.Text className={styles.bgInput}>
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tim kiem theo ten hoac mo ta..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={styles.bgInput}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as RewardFilterStatus)}
                                    className={styles.bgInput}
                                >
                                    <option value="All">Tat ca trang thai</option>
                                    <option value="Active">Dang hoat dong</option>
                                    <option value="Inactive">Ngung hoat dong</option>
                                    <option value="InStock">Con hang</option>
                                    <option value="OutOfStock">Het hang</option>
                                </Form.Select>
                            </Col>
                            <Col md={3} className="text-md-end text-secondary d-flex align-items-center justify-content-md-end">
                                Tong: <span className="fw-semibold ms-1">{filteredRewards.length}</span> qua tang
                            </Col>
                        </Row>

                        {loading && !showModal ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="light" />
                                <div className="mt-3 text-secondary">Dang tai du lieu...</div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className={`align-middle mb-0 ${styles.rewardsTable}`}>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Hinh anh</th>
                                            <th>Ten qua</th>
                                            <th>Mo ta</th>
                                            <th>Gia xu</th>
                                            <th>Ton kho</th>
                                            <th>Trang thai</th>
                                            <th className="text-center">Thao tac</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRewards.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="text-center py-4">
                                                    <FaBoxOpen size={40} className="text-muted mb-2" />
                                                    <div className="text-secondary">Khong tim thay qua tang nao</div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRewards.map((reward) => (
                                                <tr key={reward.id}>
                                                    <td className="text-secondary">#{reward.id}</td>
                                                    <td>
                                                        {reward.imageUrl ? (
                                                            <img
                                                                src={`${backendBaseURL}${reward.imageUrl}`}
                                                                alt={reward.name}
                                                                className={styles.rewardThumb}
                                                            />
                                                        ) : (
                                                            <div className={`${styles.rewardThumb} ${styles.placeholder}`}>
                                                                <FaGift className="text-muted" />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className={styles.mutedText}><strong>{reward.name}</strong></td>
                                                    <td>
                                                        <div className={styles.mutedText} style={{ maxWidth: 260 }} title={reward.description}>
                                                            {reward.description || '-'}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Badge bg="warning" text="dark" className="fs-6 px-3 py-1">
                                                            <FaCoins className="me-1" />
                                                            {reward.cost}
                                                        </Badge>
                                                    </td>
                                                    <td className={styles.mutedText}>{reward.stockQuantity ?? reward.quantity ?? 0}</td>
                                                    <td>{getStatusBadge(reward)}</td>
                                                    <td className="text-center">
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleShowRewardModal('edit', reward)}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => handleShowRewardModal('delete', reward)}
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
                onHide={handleCloseRewardModal}
                size="lg"
                centered
                className={styles.rewardEditModal}
            >
                <Modal.Header closeButton className="bg-dark text-light border-0">
                    <Modal.Title>{modalType === 'create' ? 'Tao qua tang moi' : 'Chinh sua qua tang'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={(event) => void handleSubmit(event)}>
                    <Modal.Body className="bg-dark text-light">
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Ten qua tang *</Form.Label>
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
                                    <Form.Label>Mo ta</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Mo ta chi tiet ve qua tang..."
                                        className="bg-dark text-light"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Hinh anh</Form.Label>
                                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} className="bg-dark text-light" />
                                    {previewUrl && (
                                        <div className="mt-2">
                                            <img src={previewUrl} alt="Preview" className={styles.rewardPreview} />
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Gia xu *</Form.Label>
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
                                            min={1}
                                            placeholder="100"
                                            className="bg-dark text-light border-1"
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>So luong ton kho *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                        required
                                        min={0}
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
                                        label="Con hang (co the doi)"
                                        checked={formData.inStock}
                                        onChange={handleInputChange}
                                        className="text-secondary"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Trang thai san pham *</Form.Label>
                                    <Form.Select
                                        name="active"
                                        value={String(formData.active)}
                                        onChange={handleInputChange}
                                        className="bg-dark text-light"
                                    >
                                        <option value="true">Dang hoat dong</option>
                                        <option value="false">Ngung hoat dong</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="bg-dark border-0">
                        <Button variant="outline-secondary" onClick={handleCloseRewardModal}>Huy</Button>
                        <Button variant="primary" className={styles.btnGradient} type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Dang xu ly...
                                </>
                            ) : modalType === 'create' ? 'Tao moi' : 'Cap nhat'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal
                show={showModal && modalType === 'delete'}
                onHide={handleCloseRewardModal}
                centered
                className={styles.rewardDeleteModal}
            >
                <Modal.Header closeButton className="bg-dark text-light border-0">
                    <Modal.Title>Xac nhan xoa</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    <p>Ban co chac chan muon xoa qua tang <strong>{selectedReward?.name}</strong> khong?</p>
                    <p className="text-danger mb-0"><small>Hanh dong nay khong the hoan tac!</small></p>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-0">
                    <Button variant="outline-secondary" onClick={handleCloseRewardModal}>Huy</Button>
                    <Button variant="danger" onClick={() => void handleDelete()} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Dang xoa...
                            </>
                        ) : 'Xoa'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminRewardsSection;
