import WhySection from "../../sections/home/WhySection";
import ExploreQuizCategories from "../../sections/home/ExploreQuizCategories";
import HeroSection from "../../sections/home/HeroSection";
import './HomePage.scss';
import { useHomeData } from "../../hooks/useHomeData";
const HomePage: React.FC = () => {
    const { quizCategories, isLoading } = useHomeData();
    return (
        <>
            <div className="homepage-container">
                <HeroSection />
                <ExploreQuizCategories isLoading={isLoading} subjects={quizCategories} />
                <WhySection />
            </div>
        </>
    );
}

export default HomePage;
