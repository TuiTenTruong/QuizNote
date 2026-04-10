import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Spinner,
} from "react-bootstrap";
import {
    FaCheckCircle,
    FaCoins,
    FaGift,
    FaHistory,
    FaMapMarkerAlt,
    FaPhone,
    FaQuestion,
    FaTimesCircle,
    FaUser,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosCustomize";
import { redeemReward } from "../../api/reward.api";
import { updateCoins } from "../../redux/action/userAction";
import { useRewardShopQuery } from "../../hooks/useRewardShop";
import type { IReqRedeemReward, IReward, IRewardRedeemRecipient, IRewardUiAlert } from "../../types/reward";
import "./scss/RewardShopSection.scss";

interface RootState {
    user?: {
        account?: {
            id?: number;
            coins?: number;
        } | null;
    };
}

const INITIAL_RECIPIENT: IRewardRedeemRecipient = {
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
};

const RewardShopSection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user?.account);
    const { rewards, loading, fetchRewards } = useRewardShopQuery();
    const [coinBalance, setCoinBalance] = useState<number>(user?.coins || 0);
    const [selectedReward, setSelectedReward] = useState<IReward | null>(null);
    const [showRedeemModal, setShowRedeemModal] = useState<boolean>(false);
    const [redeeming, setRedeeming] = useState<boolean>(false);
    const [alert, setAlert] = useState<IRewardUiAlert | null>(null);
    const [recipientInfo, setRecipientInfo] = useState<IRewardRedeemRecipient>(INITIAL_RECIPIENT);

    useEffect(() => {
        setCoinBalance(user?.coins || 0);
    }, [user]);

    const backendBaseURL = useMemo(() => `${axiosInstance.defaults.baseURL}storage/rewards/`, []);

    const handleOpenRedeemModal = useCallback((reward: IReward) => {
        setSelectedReward(reward);
        setRecipientInfo(INITIAL_RECIPIENT);
        setShowRedeemModal(true);
    }, []);

    const handleCloseRedeemModal = useCallback(() => {
        setShowRedeemModal(false);
        setSelectedReward(null);
    }, []);

    const handleRecipientChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setRecipientInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const confirmRedeem = useCallback(async () => {
        if (!selectedReward) {
            return;
        }

        if (!recipientInfo.recipientName || !recipientInfo.recipientPhone || !recipientInfo.recipientAddress) {
            setAlert({
                type: "danger",
                text: "Vui long dien day du thong tin nguoi nhan!",
            });
            return;
        }

        setRedeeming(true);
        try {
            const payload: IReqRedeemReward = {
                rewardId: selectedReward.id,
                recipientName: recipientInfo.recipientName,
                recipientPhone: recipientInfo.recipientPhone,
                recipientAddress: recipientInfo.recipientAddress,
            };

            const response = await redeemReward(payload);
            if (response && response.data) {
                const nextCoinBalance = coinBalance - selectedReward.cost;
                setCoinBalance(nextCoinBalance);
                dispatch(updateCoins(nextCoinBalance));
                setAlert({
                    type: "success",
                    text: `Ban da doi thanh cong \"${selectedReward.name}\".`,
                });
                await fetchRewards();
                handleCloseRedeemModal();
            }
        } catch (error) {
            console.error("Error redeeming reward:", error);
            setAlert({
                type: "danger",
                text: "Doi thuong that bai. Vui long thu lai.",
            });
        } finally {
            setRedeeming(false);
        }
    }, [coinBalance, dispatch, fetchRewards, handleCloseRedeemModal, recipientInfo, selectedReward]);

    return (
        <div className="reward-shop-page">
            <Container className="py-4">
                <Row className="mb-4">
                    <Col>
                        <h2 className="fw-bold text-gradient mb-1">Doi Thuong Qua Tang</h2>
                        <p className="text-muted mb-0">
                            Doi cac mon qua hap dan bang xu tich luy tu Weekly Quiz!
                        </p>
                    </Col>
                    <Col xs="auto" className="text-end d-flex gap-2 align-items-center">
                        <Button
                            className="btn-outline-gradient"
                            size="sm"
                            onClick={() => navigate("/my-reward-transactions")}
                        >
                            <FaHistory className="me-2" />
                            Lich su doi thuong
                        </Button>
                        <div className="coin-box px-4 py-2 d-inline-block rounded-pill bg-dark shadow-sm">
                            <FaCoins className="me-1 text-warning" />
                            <span className="fw-bold fs-5 text-warning">{coinBalance}</span>
                            <span className="text-secondary ms-2">xu cua ban</span>
                        </div>
                    </Col>
                </Row>

                {alert && (
                    <Alert
                        variant={alert.type}
                        onClose={() => setAlert(null)}
                        dismissible
                        className="mb-4"
                    >
                        {alert.text}
                    </Alert>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <div className="mt-3 text-secondary">Dang tai qua tang...</div>
                    </div>
                ) : (
                    <Row className="g-4">
                        {rewards.length === 0 ? (
                            <Col>
                                <div className="text-center text-secondary py-5">
                                    <FaQuestion size={36} className="mb-3" />
                                    <div>Chua co qua tang nao kha dung.</div>
                                </div>
                            </Col>
                        ) : (
                            rewards.map((reward) => {
                                const enough = coinBalance >= reward.cost;
                                return (
                                    <Col xs={12} sm={6} md={4} lg={3} key={reward.id}>
                                        <Card
                                            className={`gift-card text-light h-100 shadow-sm ${!reward.inStock ? "disabled" : enough ? "can-redeem" : ""}`}
                                        >
                                            <Card.Img
                                                variant="top"
                                                src={reward.imageUrl ? `${backendBaseURL}${reward.imageUrl}` : ""}
                                                className="gift-img"
                                                alt={reward.name}
                                                style={{ objectFit: "contain", background: "#181425" }}
                                            />
                                            <Card.Body className="d-flex flex-column">
                                                <h5 className="fw-semibold">{reward.name}</h5>
                                                <p className="text-secondary small mb-2">{reward.description}</p>
                                                <div className="d-flex gap-2 align-items-center mb-3">
                                                    <Badge bg="warning" className="fs-6 px-3 py-2 text-dark">
                                                        <FaCoins className="me-1" />
                                                        {reward.cost} xu
                                                    </Badge>
                                                    {!reward.inStock ? (
                                                        <Badge bg="secondary" className="ms-1">Het qua</Badge>
                                                    ) : enough ? (
                                                        <Badge bg="success" className="ms-1">Du xu</Badge>
                                                    ) : (
                                                        <Badge bg="danger" className="ms-1">Thieu xu</Badge>
                                                    )}
                                                </div>
                                                <Button
                                                    className="btn-gradient mt-auto"
                                                    disabled={!reward.inStock || !enough}
                                                    onClick={() => handleOpenRedeemModal(reward)}
                                                >
                                                    <FaGift className="me-2" />
                                                    {reward.inStock ? "Doi thuong" : "Het qua"}
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })
                        )}
                    </Row>
                )}
            </Container>

            <Modal show={showRedeemModal} onHide={handleCloseRedeemModal} centered className="reward-modal">
                <Modal.Header closeButton className="bg-dark text-light">
                    <Modal.Title>Xac nhan doi thuong</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    {selectedReward && (
                        <>
                            <div className="mb-4 text-center">
                                <img
                                    src={`${backendBaseURL}${selectedReward.imageUrl}`}
                                    alt={selectedReward.name}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: "contain", borderRadius: "12px" }}
                                />
                                <h5 className="fw-bold mt-3">{selectedReward.name}</h5>
                                <div className="text-secondary mb-3">{selectedReward.description}</div>
                                <Badge bg="info" className="fs-6 mb-3" pill>
                                    <FaCoins className="me-1" />
                                    Se ton {selectedReward.cost} xu
                                </Badge>
                            </div>

                            <div className="mb-4">
                                <h6 className="text-warning mb-3">Thong tin nguoi nhan</h6>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaUser className="me-2" />
                                            Ho va ten *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="recipientName"
                                            value={recipientInfo.recipientName}
                                            onChange={handleRecipientChange}
                                            placeholder="Nhap ho ten nguoi nhan"
                                            className="bg-dark text-light border-secondary"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaPhone className="me-2" />
                                            So dien thoai *
                                        </Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="recipientPhone"
                                            value={recipientInfo.recipientPhone}
                                            onChange={handleRecipientChange}
                                            placeholder="Nhap so dien thoai"
                                            className="bg-dark text-light border-secondary"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaMapMarkerAlt className="me-2" />
                                            Dia chi nhan hang *
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="recipientAddress"
                                            value={recipientInfo.recipientAddress}
                                            onChange={handleRecipientChange}
                                            placeholder="Nhap dia chi chi tiet"
                                            className="bg-dark text-light border-secondary"
                                            required
                                        />
                                    </Form.Group>
                                </Form>
                            </div>

                            <div className="text-center">
                                <Button
                                    className="btn-gradient px-4"
                                    size="lg"
                                    onClick={() => void confirmRedeem()}
                                    disabled={redeeming}
                                >
                                    {redeeming ? (
                                        <Spinner animation="border" size="sm" className="me-2" />
                                    ) : (
                                        <FaCheckCircle className="me-2" />
                                    )}
                                    Xac nhan doi thuong
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-0 justify-content-center">
                    <Button variant="outline-secondary" onClick={handleCloseRedeemModal} disabled={redeeming}>
                        <FaTimesCircle className="me-2" />
                        Bo qua
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RewardShopSection;
