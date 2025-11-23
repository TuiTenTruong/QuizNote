import { Container, Button } from "react-bootstrap";
import './HomePage.scss'
import { useEffect, useState } from "react";
import { getExploreData } from "../../services/apiService";
import { FaStar } from "react-icons/fa6";
import axiosInstance from '../../utils/axiosCustomize';
import { Link } from "react-router-dom";
const ExploreQuizCategories = () => {
    const [quizCategories, setQuizCategories] = useState([]);
    useEffect(() => {
        const fetchQuizCategories = async () => {
            const response = await getExploreData();
            console.log(response);
            if (response && response.statusCode === 200) {
                setQuizCategories(response.data.result);
            } else {
                console.error('Failed to fetch quiz categories', response);
            }
        };
        fetchQuizCategories();
    }, []);
    console.log(quizCategories);
    const colors = ['#f87171', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa', '#f472b6'];
    const random = colors[Math.floor(Math.random() * colors.length)];
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/subjects/";
    return <>
        <section className="quiz-categories text-light py-5">
            <Container>
                <h2 className="fw-bold mb-3 text-start text-sm-center">
                    Khám phá <span className="text-gradient">môn học</span>
                </h2>

                <p className="text-white mb-4 text-start text-sm-center w-75 w-sm-100 mx-sm-auto">
                    Khám phá các bài quiz thuộc nhiều chủ đề khác nhau để kiểm tra và mở rộng kiến thức của bạn.
                </p>

                <div className="row g-3">
                    {quizCategories && quizCategories.length > 0 && quizCategories.map((category) => (

                        <div key={category.id} className="col-12 col-md-6 col-lg-4">
                            <div className="category-card p-4 rounded-4 h-100 position-relative">
                                {category.imageUrl && (
                                    <div
                                        className="icon-box d-inline-flex align-items-center justify-content-center mb-3 rounded-circle"
                                        style={{ backgroundColor: random + "20", color: category.color, width: '60px', height: '60px' }}
                                    >
                                        <img
                                            className="category-icon"
                                            src={backendBaseURL + category.imageUrl}
                                            alt={category.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    </div>
                                )}
                                <h5 className="fw-semibold">{category.name}</h5>
                                {category.averageRating && (
                                    <span className="align-items-center d-flex position-absolute top-0 end-0 m-3"><FaStar className="pe-1 text-warning" />{category.averageRating}</span>
                                )}
                                <p className="text-white small mb-3">
                                    {category.description}
                                </p>
                                <Button as={Link} to={`/student/quizzes/${category.id}`} variant="link" className="text-primary p-0">Khám phá →</Button>
                            </div>
                        </div>
                    ))}

                </div>
            </Container>
        </section>
    </>
}
export default ExploreQuizCategories;