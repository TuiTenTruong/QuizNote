import { useState } from "react";
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
} from "react-icons/fa";
import "./RewardShopPage.scss";

// Danh sách quà mẫu – có thể lấy từ API
const MOCK_REWARDS = [
    {
        id: 1,
        name: "Voucher Momo 50k",
        imageUrl: "https://i.imgur.com/Qr3rCpD.png",
        description: "Voucher thanh toán MoMo 50.000₫ dùng cho toàn bộ dịch vụ.",
        cost: 300,
        inStock: true,
    },
    {
        id: 2,
        name: "Phiếu mua sách Fahasa 100k",
        imageUrl: "https://i.imgur.com/SPnGfor.png",
        description: "Tặng phiếu điện tử mua sách/ebook tại fahasa.com trị giá 100.000₫.",
        cost: 550,
        inStock: true,
    },
    {
        id: 3,
        name: "Học bổng QuizNote",
        imageUrl: "https://i.imgur.com/yR2ac9Z.png",
        description: "Nhận học bổng 200.000₫ thanh toán trực tiếp cho học phí online.",
        cost: 999,
        inStock: false,
    },
    {
        id: 4,
        name: "Combo huy hiệu vàng + avatar đặc biệt",
        imageUrl: "https://i.imgur.com/cVpMB3o.png",
        description: "Combo badge vàng và quyền đổi avatar đặc biệt trong profile.",
        cost: 180,
        inStock: true,
    },
];

// Số xu hiện tại – thực tế lấy từ user API
const MOCK_COIN_BALANCE = 542;

function RewardShopPage() {
    const [coinBalance, setCoinBalance] = useState(MOCK_COIN_BALANCE);
    const [rewards] = useState(MOCK_REWARDS); // sau này dùng useEffect với getAllRewards
    const [selected, setSelected] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [redeeming, setRedeeming] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleRedeem = (reward) => {
        setSelected(reward);
        setModalShow(true);
    };

    const confirmRedeem = async () => {
        if (!selected) return;
        setRedeeming(true);
        // Giả lập API: sau này POST /api/rewards/redeem
        setTimeout(() => {
            if (coinBalance >= selected.cost && selected.inStock) {
                setCoinBalance((b) => b - selected.cost);
                setAlert({
                    type: "success",
                    text: `Bạn đã đổi thành công "${selected.name}". Vui lòng kiểm tra email để nhận hướng dẫn!`
                });
            } else {
                setAlert({
                    type: "danger",
                    text: "Không đủ xu hoặc quà đã hết. Đổi thưởng thất bại."
                });
            }
            setRedeeming(false);
            setModalShow(false);
        }, 1200);
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
                    <Col xs="auto" className="text-end">
                        <div className="coin-box px-4 py-2 d-inline-block rounded-pill bg-dark shadow-sm my-2">
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
                                            src={r.imageUrl}
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
                        <FaGift className="me-2 text-warning" />
                        Xác nhận đổi thưởng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    {selected && (
                        <>
                            <div className="mb-3 text-center">
                                <img
                                    src={selected.imageUrl}
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
