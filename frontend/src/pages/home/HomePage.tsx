import WhySection from "../../sections/home/WhySection";
import ExploreQuizCategories from "../../sections/home/ExploreQuizCategories";
import HeroSection from "../../sections/home/HeroSection";
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
    return (
        <>
            <div className={styles.homepageContainer}>
                <HeroSection />
                <ExploreQuizCategories />
                <WhySection />
            </div>
        </>
    );
}

export default HomePage;
