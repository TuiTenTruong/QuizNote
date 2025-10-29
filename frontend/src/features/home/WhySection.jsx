import { Container, Row, Col } from "react-bootstrap";
import { FaBrain, FaGift, FaChalkboardTeacher, FaChartLine, FaTrophy, FaMobileAlt } from "react-icons/fa";
import "./HomePage.scss";
import ColorImage from '../../assets/images/undraw_questions_g2px.svg'
const features = [
    {
        icon: <FaBrain />,
        title: "Diverse Quiz Collections",
        desc: "Access hundreds of carefully designed quiz sets from teachers and top students across subjects.",
        color: "#9333ea",
    },
    {
        icon: <FaGift />,
        title: "Buy & Share Quiz Sets",
        desc: "Easily purchase, sell, or share quiz collections to help others learn and practice effectively.",
        color: "#f97316",
    },
    {
        icon: <FaChalkboardTeacher />,
        title: "For Teachers & Creators",
        desc: "Create and manage your own quiz sets with detailed explanations and structured topics.",
        color: "#2563eb",
    },
    {
        icon: <FaChartLine />,
        title: "Smart Progress Tracking",
        desc: "Track your learning journey with detailed stats and improvement insights.",
        color: "#22c55e",
    },
    {
        icon: <FaTrophy />,
        title: "Practice & Improve",
        desc: "Enhance your knowledge through continuous testing and self-evaluation.",
        color: "#eab308",
    },
    {
        icon: <FaMobileAlt />,
        title: "Responsive & Accessible",
        desc: "Use the platform seamlessly on any device, anytime, anywhere.",
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
                        Discover quizzes across various subjects to test and expand your knowledge.
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
                            Ready to Start Your Quiz Journey?
                        </h2>
                        <p className="my-3">
                            Join thousands of students and teachers. Sign up today and get access to all features
                        </p>
                        <div className="d-sm-flex">
                            <button className="create-button btn btn-light w-100 m-1">Create Account</button>
                            <button className="create-button btn w-100 btn-outline-light m-1">Explore Quizzes</button>
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
