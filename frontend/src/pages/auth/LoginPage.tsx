import React from "react";
import LoginSection from "../../sections/auth/LoginSection";
import styles from "./LoginPage.module.scss";

const LoginPage: React.FC = () => {
    return (
        <div className={styles.loginPageContainer}>
            <LoginSection />
        </div>
    );
};

export default LoginPage;
