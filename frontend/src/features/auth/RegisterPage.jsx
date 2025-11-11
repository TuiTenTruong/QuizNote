import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useState } from "react";
import "./RegisterLoginPage.scss";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { postCreateNewUser } from "../../services/apiService";
import NavigateHomeButton from "./components/NavigateHomeButton";
const RegisterPage = () => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [type, setType] = useState('password');
    const [role, setRole] = useState('STUDENT'); // STUDENT or SELLER
    const [bankName, setBankName] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const navigate = useNavigate()
    const handleToggle = () => {
        if (type === 'password') {
            setType('text')
        } else {
            setType('password')
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        // validate
        if (!name || !gender || !email || !password || !confirmPassword) {
            toast.error("Hãy điền đầy đủ thông tin.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Mật khẩu không khớp.");
            return;
        }

        // Validate seller fields
        if (role === 'SELLER') {
            if (!bankName || !bankAccount) {
                toast.error("Hãy điền đầy đủ thông tin ngân hàng cho tài khoản người bán.");
                return;
            }
        }

        let res = await postCreateNewUser(email, password, name, gender, role, bankName, bankAccount);
        console.log(res);
        if (res.data && (res.statusCode === 200 || res.statusCode === 201)) {

            toast.success(res.data.message);
            navigate("/login");
        } else {
            toast.error(res.message);
        }
    }

    return (
        <section className="register-page position-relative">
            <div className="position-absolute top-1 start-1 m-3" ><NavigateHomeButton /></div>
            <Container fluid className="g-0">
                <Row className="min-vh-100 g-0">
                    {/* LEFT SIDE */}
                    <Col
                        md={6}
                        className="register-left d-none d-md-flex align-items-center justify-content-center"
                    >
                        <h1 className="display-4 fw-bold text-gradient">QuizNote</h1>
                    </Col>

                    {/* RIGHT SIDE */}
                    <Col xs={12} md={6} className="register-right d-flex align-items-center justify-content-center">
                        <div className="form-box p-4 p-sm-5 rounded-4 shadow">
                            <h3 className="fw-bold mb-2">Đăng kí tài khoản</h3>
                            <p className="text-muted mb-4">
                                Chọn loại tài khoản của bạn và bắt đầu hành trình với chúng tôi
                            </p>

                            {/* ROLE SELECTION */}
                            <div className="d-flex gap-3 mb-4 flex-column flex-sm-row">
                                <div
                                    className={`role-card ${role === 'STUDENT' ? 'active' : ''} flex-fill text-center p-3 rounded-3 w-50`}
                                    onClick={() => setRole('STUDENT')}
                                    style={{ cursor: 'pointer' }}

                                >
                                    <FaGraduationCap className="fs-4 mb-2" />
                                    <p className="fw-semibold mb-0">Student</p>
                                    <small className="text-muted">Tham gia các bài kiểm tra và theo dõi tiến trình</small>
                                </div>
                                <div
                                    className={`role-card ${role === 'SELLER' ? 'active' : ''} flex-fill text-center p-3 rounded-3 w-50`}
                                    onClick={() => setRole('SELLER')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FaChalkboardTeacher className="fs-4 mb-2" />
                                    <p className="fw-semibold mb-0">Seller</p>
                                    <small className="text-muted">Tạo và bán các bài kiểm tra</small>
                                </div>
                            </div>

                            {/* SOCIAL LOGIN */}
                            <div className="d-flex gap-3 mb-4">
                                <Button variant="light" className="flex-fill border">
                                    <FcGoogle className="me-2" /> Google
                                </Button>
                                <Button variant="light" className="flex-fill border">
                                    <FaFacebookF className="me-2 text-primary" /> Facebook
                                </Button>
                            </div>

                            <div className="text-center text-muted mb-3">OR</div>

                            {/* FORM */}
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">

                                    <Col xs={12} sm={6}>
                                        <Form.Group controlId="name">
                                            <Form.Control type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Group controlId="gender">
                                            <Form.Control type="select" as="select" value={gender} onChange={(e) => setGender(e.target.value)}>
                                                <option value="" disabled>Giới tính</option>
                                                <option value="MALE">Nam</option>
                                                <option value="FEMALE">Nữ</option>
                                                <option value="OTHER">Khác</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="email">
                                            <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="password" className="position-relative">
                                            <Form.Control type={type} placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <span className="show-hide-btn position-absolute end-0 top-50 translate-middle-y pe-2" onClick={handleToggle}>
                                                {type === 'password' ? <IoMdEyeOff className="fs-4" /> : <IoEye className="fs-4" />}
                                            </span>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="confirmPassword" className="position-relative">
                                            <Form.Control type={type} placeholder="Xác nhận lại mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                            <span className="show-hide-btn position-absolute end-0 top-50 translate-middle-y pe-2" onClick={handleToggle}>
                                                {type === 'password' ? <IoMdEyeOff className="fs-4" /> : <IoEye className="fs-4" />}
                                            </span>
                                        </Form.Group>
                                    </Col>

                                    {/* SELLER BANK INFO */}
                                    {role === 'SELLER' && (
                                        <>
                                            <Col xs={12}>
                                                <Form.Group controlId="bankName">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Tên ngân hàng (ví dụ: Vietcombank, BIDV)"
                                                        value={bankName}
                                                        onChange={(e) => setBankName(e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Group controlId="bankAccount">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Số tài khoản ngân hàng"
                                                        value={bankAccount}
                                                        onChange={(e) => setBankAccount(e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </>
                                    )}
                                </Row>

                                <Button
                                    variant="primary"
                                    className="w-100 mt-4 btn-gradient fw-semibold py-2"
                                    type="submit"
                                >
                                    Đăng ký
                                </Button>
                            </Form>

                            <p className="text-center mt-4 text-muted">
                                Bạn đã có tài khoản?{" "}
                                <a href="/login" className="text-gradient fw-semibold text-decoration-none">
                                    Đăng nhập
                                </a>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default RegisterPage;
