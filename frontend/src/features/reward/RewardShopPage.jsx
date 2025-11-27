import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Modal,
    Spinner,
    Alert,
} from "react-bootstrap";
import {
    FaGift,
    FaCoins,
    FaCheckCircle,
    FaTimesCircle,
    FaQuestion,
    FaHistory,
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAvailableRewards, redeemReward } from "../../services/apiService";
import { updateCoins } from "../../redux/action/userAction";
import "./RewardShopPage.scss";
import { Form } from "react-bootstrap";
import instance from "../../utils/axiosCustomize";

function RewardShopPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.account);
    const [coinBalance, setCoinBalance] = useState(user?.coins || 0);
    const [rewards, setRewards] = useState([]);
    const [selected, setSelected] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [redeeming, setRedeeming] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const backendBaseURL = (instance.defaults.baseURL + 'storage/rewards/') || '';
    const [recipientInfo, setRecipientInfo] = useState({
        recipientName: '',
        recipientPhone: '',
        recipientAddress: ''
    });

    useEffect(() => {
        fetchRewards();
    }, []);

    useEffect(() => {
        if (user) {
            setCoinBalance(user.coins || 0);
        }
    }, [user]);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            const res = await getAvailableRewards();
            if (res && res.data) {
                setRewards(res.data);
            }
        } catch (error) {
            console.error("Error fetching rewards:", error);
            setAlert({
                type: "danger",
                text: "Không thể tải danh sách quà tặng. Vui lòng thử lại sau."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = (reward) => {
        setSelected(reward);
        setRecipientInfo({
            recipientName: '',
            recipientPhone: '',
            recipientAddress: ''
        });
        setModalShow(true);
    };

    const handleRecipientChange = (e) => {
        setRecipientInfo({
            ...recipientInfo,
            [e.target.name]: e.target.value
        });
    };

    const confirmRedeem = async () => {
        if (!selected) return;

        // Validate recipient info
        if (!recipientInfo.recipientName || !recipientInfo.recipientPhone || !recipientInfo.recipientAddress) {
            setAlert({
                type: "danger",
                text: "Vui lòng điền đầy đủ thông tin người nhận!"
            });
            return;
        }

        setRedeeming(true);

        try {
            // Send the correct payload to the backend
            const payload = {
                rewardId: selected.id,
                recipientName: recipientInfo.recipientName,
                recipientPhone: recipientInfo.recipientPhone,
                recipientAddress: recipientInfo.recipientAddress
            };

            const res = await redeemReward(selected.id, recipientInfo.recipientName, recipientInfo.recipientPhone, recipientInfo.recipientAddress);
            if (res && res.data) {
                const newCoinBalance = coinBalance - selected.cost;
                setCoinBalance(newCoinBalance);
                // Update coins in Redux store
                dispatch(updateCoins(newCoinBalance));
                setAlert({
                    type: "success",
                    text: `Bạn đã đổi thành công "${selected.name}". Vui lòng kiểm tra email để nhận hướng dẫn!`
                });
                // Refresh rewards list
                await fetchRewards();
            }
        } catch (error) {
            console.error("Error redeeming reward:", error);
            const errorMessage = error.response?.data?.message || "Đổi thưởng thất bại. Vui lòng thử lại.";
            setAlert({
                type: "danger",
                text: errorMessage
            });
        } finally {
            setRedeeming(false);
            setModalShow(false);
        }
    };

    return (
        <div className="reward-shop-page">
            <Container className="py-4">
                <Row className="mb-4">
                    <Col>
                        <h2 className="fw-bold text-gradient mb-1">
                            Đổi Thưởng Quà Tặng
                        </h2>
                        <p className="text-muted mb-0">
                            Đổi các món quà hấp dẫn bằng xu tích lũy từ Weekly Quiz!
                        </p>
                    </Col>
                    <Col xs="auto" className="text-end d-flex gap-2 align-items-center">
                        <Button
                            className="btn-outline-gradient"
                            size="sm"
                            onClick={() => navigate('/my-reward-transactions')}
                        >
                            <FaHistory className="me-2" />
                            Lịch sử đổi thưởng
                        </Button>
                        <div className="coin-box px-4 py-2 d-inline-block rounded-pill bg-dark shadow-sm">
                            <FaCoins className="me-1 text-warning" />
                            <span className="fw-bold fs-5 text-warning">{coinBalance}</span>
                            <span className="text-secondary ms-2">xu của bạn</span>
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
                        <div className="mt-3 text-secondary">Đang tải quà tặng...</div>
                    </div>
                ) : (
                    <Row className="g-4">
                        {rewards.length === 0 ? (
                            <Col>
                                <div className="text-center text-secondary py-5">
                                    <FaQuestion size={36} className="mb-3" />
                                    <div>Chưa có quà tặng nào khả dụng.</div>
                                </div>
                            </Col>
                        ) : (
                            rewards.map((r) => {
                                const enough = coinBalance >= r.cost;
                                return (
                                    <Col xs={12} sm={6} md={4} lg={3} key={r.id}>
                                        <Card
                                            className={`gift-card text-light h-100 shadow-sm ${!r.inStock ? "disabled" : enough ? "can-redeem" : ""}`}
                                        >
                                            <Card.Img
                                                variant="top"
                                                src={r.imageUrl ? backendBaseURL + r.imageUrl : ''}
                                                className="gift-img"
                                                alt={r.name}
                                                style={{ objectFit: "contain", background: "#181425" }}
                                            />
                                            <Card.Body className="d-flex flex-column">
                                                <h5 className="fw-semibold">{r.name}</h5>
                                                <p className="text-secondary small mb-2">
                                                    {r.description}
                                                </p>
                                                <div className="d-flex gap-2 align-items-center mb-3">
                                                    <Badge bg="warning" className="fs-6 px-3 py-2 text-dark">
                                                        <FaCoins className="me-1" />
                                                        {r.cost} xu
                                                    </Badge>
                                                    {!r.inStock ? (
                                                        <Badge bg="secondary" className="ms-1">
                                                            Hết quà
                                                        </Badge>
                                                    ) : enough ? (
                                                        <Badge bg="success" className="ms-1">
                                                            Đủ xu
                                                        </Badge>
                                                    ) : (
                                                        <Badge bg="danger" className="ms-1">
                                                            Thiếu xu
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Button
                                                    className="btn-gradient mt-auto"
                                                    disabled={!r.inStock || !enough}
                                                    onClick={() => handleRedeem(r)}
                                                >
                                                    <FaGift className="me-2" />
                                                    {r.inStock ? "Đổi thưởng" : "Hết quà"}
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

            {/* Modal xác nhận đổi thưởng */}
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                centered
                className="reward-modal"
            >
                <Modal.Header closeButton className="bg-dark text-light">
                    <Modal.Title>
                        Xác nhận đổi thưởng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    {selected && (
                        <>
                            <div className="mb-4 text-center">
                                <img
                                    src={backendBaseURL + selected.imageUrl}
                                    alt={selected.name}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: "contain", borderRadius: "12px" }}
                                />
                                <h5 className="fw-bold mt-3">{selected.name}</h5>
                                <div className="text-secondary mb-3">{selected.description}</div>
                                <Badge bg="info" className="fs-6 mb-3" pill>
                                    <FaCoins className="me-1" />
                                    Sẽ tốn {selected.cost} xu
                                </Badge>
                            </div>

                            {/* Recipient Information Form */}
                            <div className="mb-4">
                                <h6 className="text-warning mb-3">Thông tin người nhận</h6>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaUser className="me-2" />
                                            Họ và tên *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="recipientName"
                                            value={recipientInfo.recipientName}
                                            onChange={handleRecipientChange}
                                            placeholder="Nhập họ tên người nhận"
                                            className="bg-dark text-light border-secondary"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaPhone className="me-2" />
                                            Số điện thoại *
                                        </Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="recipientPhone"
                                            value={recipientInfo.recipientPhone}
                                            onChange={handleRecipientChange}
                                            placeholder="Nhập số điện thoại"
                                            className="bg-dark text-light border-secondary"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaMapMarkerAlt className="me-2" />
                                            Địa chỉ nhận hàng *
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="recipientAddress"
                                            value={recipientInfo.recipientAddress}
                                            onChange={handleRecipientChange}
                                            placeholder="Nhập địa chỉ chi tiết"
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
                                    onClick={confirmRedeem}
                                    disabled={redeeming}
                                >
                                    {redeeming ? (
                                        <Spinner animation="border" size="sm" className="me-2" />
                                    ) : (
                                        <FaCheckCircle className="me-2" />
                                    )}
                                    Xác nhận đổi thưởng
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-0 justify-content-center">
                    <Button
                        variant="outline-secondary"
                        onClick={() => setModalShow(false)}
                        disabled={redeeming}
                    >
                        <FaTimesCircle className="me-2" />
                        Bỏ qua
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default RewardShopPage;
