import React from "react";
import RegisterSection from "../../sections/auth/RegisterSection";
import styles from "./RegisterPage.module.scss";

const RegisterPage: React.FC = () => {
    return (
        <div className={styles.registerPageContainer}>
            <RegisterSection />
        </div>
    );
};

export default RegisterPage;