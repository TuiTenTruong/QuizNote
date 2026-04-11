import { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { useSettingsPage } from "../../hooks/useSettingsPage";
import AccountSection from "../../sections/setting/AccountSection";
import ProfileSection from "../../sections/setting/ProfileSection";
import type { SettingsTab } from "../../types/settings.types";
import styles from "./SettingsPage.module.scss";

const tabs: SettingsTab[] = ["Thông tin cá nhân", "Tài khoản"];

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>("Thông tin cá nhân");
    const {
        loading,
        userData,
        profileData,
        passwordData,
        avatarFile,
        avatarPreview,
        handleProfileChange,
        handlePasswordChange,
        handleAvatarChange,
        handleUploadAvatar,
        handleSaveProfile,
        handleChangePassword,
        handleLogout
    } = useSettingsPage();

    return (
        <div className={styles.settingsPage}>
            <Container fluid="sm">
                <h3 className="fw-bold mb-3 text-gradient">Cài đặt</h3>
                <p className="text-secondary mb-4">Quản lí thông tin cá nhân và bảo mật tài khoản của bạn tại đây.</p>

                <Nav variant="tabs" activeKey={activeTab} className={`${styles.settingsTabs} mb-4`}>
                    {tabs.map((tab) => (
                        <Nav.Item key={tab}>
                            <Nav.Link
                                eventKey={tab}
                                onClick={() => setActiveTab(tab)}
                                className={activeTab === tab ? "active" : ""}
                            >
                                {tab}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>

                {activeTab === "Thông tin cá nhân" ? (
                    <ProfileSection
                        loading={loading}
                        userData={userData}
                        profileData={profileData}
                        avatarFile={avatarFile}
                        avatarPreview={avatarPreview}
                        onProfileChange={handleProfileChange}
                        onAvatarChange={handleAvatarChange}
                        onUploadAvatar={handleUploadAvatar}
                        onSaveProfile={handleSaveProfile}
                    />
                ) : (
                    <AccountSection
                        loading={loading}
                        passwordData={passwordData}
                        onPasswordChange={handlePasswordChange}
                        onChangePassword={handleChangePassword}
                        onLogout={handleLogout}
                    />
                )}
            </Container>
        </div>
    );
};

export default SettingsPage;
