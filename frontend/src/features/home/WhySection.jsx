import { Container, Row, Col, Button } from "react-bootstrap";
import { FaBrain, FaGift, FaChalkboardTeacher, FaChartLine, FaTrophy, FaMobileAlt } from "react-icons/fa";
import "./HomePage.scss";
import ColorImage from '../../assets/images/undraw_questions_g2px.svg'
import { Link } from "react-router-dom";
const features = [
    {
        icon: <FaBrain />,
        title: "Đa dạng môn học",
        desc: "Truy cập hàng trăm bộ câu hỏi được thiết kế cẩn thận từ giáo viên và học sinh hàng đầu trên nhiều môn học.",
        color: "#9333ea",
    },
    {
        icon: <FaGift />,
        title: "Mua & Chia sẻ môn học",
        desc: "Dễ dàng mua, bán hoặc chia sẻ các bộ quiz để giúp người khác học tập và luyện tập hiệu quả.",
        color: "#f97316",
    },
    {
        icon: <FaChalkboardTeacher />,
        title: "Dành cho Giáo viên & Người tạo nội dung",
        desc: "Tạo và quản lý các bộ quiz của riêng bạn với giải thích chi tiết và các chủ đề có cấu trúc.",
        color: "#2563eb",
    },
    {
        icon: <FaChartLine />,
        title: "Theo dõi tiến trình thông minh",
        desc: "Theo dõi hành trình học tập của bạn với các thống kê chi tiết và những hiểu biết về sự tiến bộ.",
        color: "#22c55e",
    },
    {
        icon: <FaTrophy />,
        title: "Luyện tập & Cải thiện",
        desc: "Nâng cao kiến thức của bạn thông qua việc kiểm tra liên tục và tự đánh giá.",
        color: "#eab308",
    },
    {
        icon: <FaMobileAlt />,
        title: "Phản hồi & Truy cập Mọi lúc Mọi nơi",
        desc: "Sử dụng nền tảng một cách liền mạch trên bất kỳ thiết bị nào, bất cứ lúc nào, bất cứ nơi đâu.",
        color: "#8b5cf6",
    },
];

const WhySection = () => {
    return (
        <section className="why-section text-light py-5">
            <Container>
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">
                        Why <span className="text-gradient">QuizNote</span>
                    </h2>
                    <p className="text-white mb-5">
                        Khám phá các bài quiz thuộc nhiều môn học khác nhau để kiểm tra và mở rộng kiến thức của bạn.
                    </p>
                </div>

                <Row className="g-3">
                    {features.map((item, index) => (
                        <Col key={index} xs={6} lg={4}>
                            <div className="feature-card p-4 rounded-4 h-100">
                                <div
                                    className="icon-box d-inline-flex align-items-center justify-content-center mb-3 rounded-circle"
                                    style={{ backgroundColor: item.color + "20", color: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <h6 className="fw-semibold">{item.title}</h6>
                                <p className="text-white small d-none d-lg-block">{item.desc}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
                <div className="box-container mt-5 mx-auto w-100 d-block d-sm-flex">
                    <div className="left-box w-100">
                        <h2 className="text-white">
                            Sẵn sàng bắt đầu hành trình Quiz của bạn?
                        </h2>
                        <p className="my-3">
                            Tham gia cùng hàng ngàn học sinh và giáo viên. Đăng ký ngay hôm nay để truy cập tất cả các tính năng
                        </p>
                        <div className="d-sm-flex">
                            <Button as={Link} to="/register" className="create-button btn btn-light w-100 m-1">Tạo tài khoản</Button>
                            <Button as={Link} to="/student" className="create-button btn w-100 btn-outline-gradient m-1">Khám phá</Button>
                        </div>
                    </div>
                    <div className="demo_image w-100">
                        <img src={ColorImage} alt="" />
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default WhySection;
