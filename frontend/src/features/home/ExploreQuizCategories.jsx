import { Container, Button } from "react-bootstrap";
import './HomePage.scss'
const ExploreQuizCategories = () => {
    return <>
        <section className="quiz-categories text-light py-5">
            <Container>
                <h2 className="fw-bold mb-3 text-start text-sm-center">
                    Explore <span className="text-gradient">Quiz Categories</span>
                </h2>

                <p className="text-white mb-4 text-start text-sm-center w-75 w-sm-100 mx-sm-auto">
                    Discover quizzes across various subjects to test and expand your knowledge.
                </p>

                <div className="row g-3">
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="category-card p-4 rounded-4 h-100">
                            <h5 className="fw-semibold">Science & Tech</h5>
                            <p className="text-white small mb-3">
                                Test your knowledge in science & technology with our challenging quizzes.
                            </p>
                            <Button variant="link" className="text-primary p-0">Explore Quizzes →</Button>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="category-card p-4 rounded-4 h-100">
                            <h5 className="fw-semibold">History & Culture</h5>
                            <p className="text-white small mb-3">
                                Dive into the past and explore culture through engaging quiz sets.
                            </p>
                            <Button variant="link" className="text-primary p-0">Explore Quizzes →</Button>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="category-card p-4 rounded-4 h-100">
                            <h5 className="fw-semibold">History & Culture</h5>
                            <p className="text-white small mb-3">
                                Dive into the past and explore culture through engaging quiz sets.
                            </p>
                            <Button variant="link" className="text-primary p-0">Explore Quizzes →</Button>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                        <div className="category-card p-4 rounded-4 h-100">
                            <h5 className="fw-semibold">History & Culture</h5>
                            <p className="text-white small mb-3">
                                Dive into the past and explore culture through engaging quiz sets.
                            </p>
                            <Button variant="link" className="text-primary p-0">Explore Quizzes →</Button>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    </>
}
export default ExploreQuizCategories;