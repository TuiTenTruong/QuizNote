import React from "react";
import AboutHeroSection from "../../sections/about/AboutHeroSection";
import AboutStatsSection from "../../sections/about/AboutStatsSection";
import AboutFeaturesSection from "../../sections/about/AboutFeaturesSection";
import AboutCTASection from "../../sections/about/AboutCTASection";
import styles from "./AboutPage.module.scss";

const AboutPage = () => {
    return (
        <div className={styles.aboutPage}>
            <AboutHeroSection />
            <AboutStatsSection />
            <AboutFeaturesSection />
            <AboutCTASection />
        </div>
    );
};

export default AboutPage;