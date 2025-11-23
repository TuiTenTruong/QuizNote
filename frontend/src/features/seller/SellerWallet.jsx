import { useEffect, useState } from "react";
import { Row, Col, Card, Button, Badge, Form, Table } from "react-bootstrap";
import { FaWallet, FaArrowUp, FaMoneyBillWave, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import "./SellerWallet.scss";
import { getWalletofSeller } from "../../services/apiService";
import { useSelector } from "react-redux";
import { GiReceiveMoney } from "react-icons/gi";
import { withdrawFromSellerWallet } from "../../services/apiService";
function SellerWallet() {
    const [balance] = useState(1320000);
    const [inputAmount, setInputAmount] = useState("");
    const [withdrawals, setWithdrawals] = useState([]);
    const seller = useSelector((state) => state.user.account);
    const fetchWithdrawals = async () => {
        const response = await getWalletofSeller(seller.id);
        setWithdrawals(response.data);
    };
    useEffect(() => {

        fetchWithdrawals();
    }, [seller.id]);

    const withdraw = async (sellerId, amount) => {
        try {
            const response = await withdrawFromSellerWallet(sellerId, amount);
            setWithdrawals(response.data);
            await fetchWithdrawals();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="seller-wallet">
            <div fluid="sm">
                <h3 className="fw-bold mb-2 text-gradient">Ví</h3>
                <p className="text-secondary mb-4">
                    Xem thu nhập của bạn, quản lý các khoản thanh toán và yêu cầu rút tiền.
                </p>

                {/* SUMMARY CARDS */}
                <Row className="g-3 mb-4">
                    <Col xs={12} md={3}>
                        <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                            <GiReceiveMoney className="icon text-warning mb-2" />
                            <h5 className="fw-bold text-white mb-1">
                                {withdrawals?.totalEarnings?.toLocaleString("vi-VN")} ₫
                            </h5>
                            <p className="text-secondary small mb-0">Tổng số dư</p>
                        </Card>
                    </Col>

                    <Col xs={12} md={3}>
                        <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                            <FaMoneyBillWave className="icon text-success mb-2" />
                            <h5 className="fw-bold text-white mb-1">{withdrawals?.earnThisMonth?.toLocaleString("vi-VN")} ₫</h5>
                            <p className="text-secondary small mb-0">Thu nhập trong tháng</p>
                        </Card>
                    </Col>
                    <Col xs={12} md={3}>
                        <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                            <FaWallet className="icon text-info mb-2" />
                            <h5 className="fw-bold text-white mb-1">
                                {withdrawals?.availableBalance?.toLocaleString("vi-VN")} ₫
                            </h5>
                            <p className="text-secondary small mb-0">Số dư khả dụng</p>
                        </Card>
                    </Col>
                    <Col xs={12} md={3}>
                        <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                            <FaClock className="icon text-warning mb-2" />
                            <h5 className="fw-bold text-white mb-1">{withdrawals?.pendingBalance?.toLocaleString("vi-VN")} ₫</h5>
                            <p className="text-secondary small mb-0">Số dư đang chờ xử lý</p>
                        </Card>
                    </Col>
                </Row>

                {/* WITHDRAW SECTION */}
                <Card className="bg-dark border-0 p-4 mb-4 shadow-sm">
                    <h5 className="fw-semibold text-white mb-3">Yêu cầu rút tiền</h5>
                    <Form className="row g-3 align-items-end">
                        <Col xs={12} md={10}>
                            <Form.Group>
                                <Form.Label className="text-light">Số tiền (₫)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    max={withdrawals?.availableBalance}
                                    placeholder="Nhập số tiền muốn rút"
                                    value={inputAmount}
                                    onChange={(e) => setInputAmount(e.target.value > withdrawals?.availableBalance ? withdrawals?.availableBalance : e.target.value)}
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={2} className="d-grid">
                            <Button className="btn-gradient py-2 fw-semibold" onClick={() => withdraw(seller.id, inputAmount)}>
                                <FaArrowUp className="me-2" /> Rút tiền
                            </Button>
                        </Col>
                    </Form>
                </Card>

                {/* WITHDRAWAL HISTORY */}
                {withdrawals.withdrawHistories != [] && withdrawals.withdrawHistories !== undefined ? <Card className="bg-dark border-0 p-4 shadow-sm">
                    <h5 className="fw-semibold text-white mb-3">Lịch sử rút tiền</h5>
                    <div className="table-responsive">
                        <Table hover borderless variant="dark" className="align-middle">
                            <thead>
                                <tr className="text-secondary small">
                                    <th>ID</th>
                                    <th>Ngày</th>
                                    <th>Số tiền</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawals.withdrawHistories.map((wd) => (
                                    <tr key={wd.id}>
                                        <td>{wd.id}</td>
                                        <td>{new Date(wd.requestedAt).toLocaleDateString("vi-VN")}</td>
                                        <td>{wd.amount.toLocaleString("vi-VN")} ₫</td>

                                        <td>
                                            <Badge
                                                bg={
                                                    wd.status === "Completed"
                                                        ? "success"
                                                        : wd.status === "Pending"
                                                            ? "warning"
                                                            : "danger"
                                                }
                                                text={wd.status === "Pending" ? "dark" : undefined}
                                            >
                                                {wd.status === "Completed" && (
                                                    <FaCheckCircle className="me-1" />
                                                )}
                                                {wd.status === "Pending" && (
                                                    <FaClock className="me-1" />
                                                )}
                                                {wd.status === "Failed" && (
                                                    <FaTimesCircle className="me-1" />
                                                )}
                                                {wd.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card> : <>
                    <div>Bạn chưa có lịch sử rút tiền</div>
                </>}

            </div>
        </div>
    );
}

export default SellerWallet;
