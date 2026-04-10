import { useState } from "react";
import { Row, Col, Card, Button, Form, Table, Badge } from "react-bootstrap";
import { FaWallet, FaArrowUp, FaMoneyBillWave, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { useSelector } from "react-redux";
import { useSellerWalletQuery, useSellerWithdrawMutation } from "../../hooks/useWallet";
import styles from "./scss/SellerWallet.module.scss";

const SellerWalletSection = () => {
    const [inputAmount, setInputAmount] = useState("");
    const seller = useSelector((state: any) => state.user.account);
    const { wallet: withdrawals, refetch } = useSellerWalletQuery(seller?.id);
    const { executeWithdraw, loading: withdrawing } = useSellerWithdrawMutation();

    const handleWithdraw = async () => {
        const amount = Number(inputAmount);
        if (!seller?.id || !amount || amount <= 0) {
            return;
        }

        try {
            await executeWithdraw(seller.id, amount);
            await refetch();
            setInputAmount("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.sellerWallet}>
            <h3 className="fw-bold mb-2 text-gradient">Vi</h3>
            <p className="text-secondary mb-4">Xem thu nhap va yeu cau rut tien.</p>

            <Row className="g-3 mb-4">
                <Col xs={12} md={3}>
                    <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                        <GiReceiveMoney className="icon text-warning mb-2" />
                        <h5 className="fw-bold text-white mb-1">{withdrawals?.totalEarnings?.toLocaleString("vi-VN")} VND</h5>
                        <p className="text-secondary small mb-0">Tong so du</p>
                    </Card>
                </Col>
                <Col xs={12} md={3}>
                    <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                        <FaMoneyBillWave className="icon text-success mb-2" />
                        <h5 className="fw-bold text-white mb-1">{withdrawals?.earnThisMonth?.toLocaleString("vi-VN")} VND</h5>
                        <p className="text-secondary small mb-0">Thu nhap thang</p>
                    </Card>
                </Col>
                <Col xs={12} md={3}>
                    <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                        <FaWallet className="icon text-info mb-2" />
                        <h5 className="fw-bold text-white mb-1">{withdrawals?.availableBalance?.toLocaleString("vi-VN")} VND</h5>
                        <p className="text-secondary small mb-0">So du kha dung</p>
                    </Card>
                </Col>
                <Col xs={12} md={3}>
                    <Card className="wallet-card p-4 text-center bg-dark border-0 shadow-sm">
                        <FaClock className="icon text-warning mb-2" />
                        <h5 className="fw-bold text-white mb-1">{withdrawals?.pendingBalance?.toLocaleString("vi-VN")} VND</h5>
                        <p className="text-secondary small mb-0">Dang cho xu ly</p>
                    </Card>
                </Col>
            </Row>

            <Card className="bg-dark border-0 p-4 mb-4 shadow-sm">
                <h5 className="fw-semibold text-white mb-3">Yeu cau rut tien</h5>
                <Form className="row g-3 align-items-end">
                    <Col xs={12} md={10}>
                        <Form.Group>
                            <Form.Label className="text-light">So tien (VND)</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                max={withdrawals?.availableBalance}
                                placeholder="Nhap so tien"
                                value={inputAmount}
                                onChange={(e) => setInputAmount(e.target.value)}
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={2} className="d-grid">
                        <Button className="btn-gradient py-2 fw-semibold" onClick={handleWithdraw} disabled={withdrawing}>
                            <FaArrowUp className="me-2" /> Rut tien
                        </Button>
                    </Col>
                </Form>
            </Card>

            {!!withdrawals?.withdrawHistories?.length && (
                <Card className="bg-dark border-0 p-4 shadow-sm">
                    <h5 className="fw-semibold text-white mb-3">Lich su rut tien</h5>
                    <div className="table-responsive">
                        <Table hover borderless variant="dark" className="align-middle">
                            <thead>
                                <tr className="text-secondary small">
                                    <th>ID</th>
                                    <th>Ngay</th>
                                    <th>So tien</th>
                                    <th>Trang thai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawals.withdrawHistories.map((wd: any) => (
                                    <tr key={wd.id}>
                                        <td>{wd.id}</td>
                                        <td>{new Date(wd.requestedAt).toLocaleDateString("vi-VN")}</td>
                                        <td>{wd.amount.toLocaleString("vi-VN")} VND</td>
                                        <td>
                                            <Badge bg={wd.status === "Completed" ? "success" : wd.status === "Pending" ? "warning" : "danger"}>
                                                {wd.status === "Completed" && <FaCheckCircle className="me-1" />}
                                                {wd.status === "Pending" && <FaClock className="me-1" />}
                                                {wd.status === "Failed" && <FaTimesCircle className="me-1" />}
                                                {wd.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SellerWalletSection;
