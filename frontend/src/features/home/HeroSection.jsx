import { Container, Button } from "react-bootstrap";
import './HomePage.scss'
const HeroSection = () => {
    return (
        <>
            <div className="hero-section text-center text-light py-5" >
                <Container className="hero-section-container align-content-center">

                    <h1 className="display-4 fw-bold mb-4 text-start text-sm-center w-xs-50 w-sm-100">
                        Study, Quiz, <span className="text-gradient">Succeed</span>
                    </h1>

                    <p className=" mb-4 text-white text-start w-xs-75 w-sm-100 text-sm-center">
                        Enhance your study with thousands of carefully designed quiz sets.
                        Learn anywhere, anytime, with instant feedback.
                    </p>

                    <div className="d-sm-flex justify-content-center gap-3 mb-5 mt-5">
                        <div className="w-sm-100 mb-3"><Button variant="primary" className="px-4 py-2 w-100 btn-gradient">Get Started</Button></div>
                        <div className="w-sm-100 mb-3"><Button variant="outline-light" className="px-4 py-2 w-100">Explore Quizzes</Button></div>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default HeroSection;