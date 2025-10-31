import WhySection from "./WhySection";
import ExploreQuizCategories from "./ExploreQuizCategories";
import HeroSection from "./HeroSection";
import './HomePage.scss';
function HomePage() {
    return (
        <>
            <div className="homepage-container">
                <HeroSection />
                <ExploreQuizCategories />
                <WhySection />
            </div>
        </>
    );
}

export default HomePage;
