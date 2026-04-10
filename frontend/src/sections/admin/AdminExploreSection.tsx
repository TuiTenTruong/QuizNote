import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import {
    FaUsers,
    FaBookOpen,
    FaShoppingCart,
    FaMoneyBillWave,
    FaChartLine,
    FaUserGraduate
} from 'react-icons/fa';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useAdminAnalytic } from '../../hooks/useAnalytic';
import type { IAdminStatusCard } from '../../types';
import styles from './scss/AdminExploreSection.module.scss';

interface IStatItem {
    icon: React.ComponentType;
    color: string;
    key: string;
}

const statsData: IStatItem[] = [
    {
        icon: FaUsers,
        color: '#9333ea',
        key: 'Total Users'
    },
    {
        icon: FaBookOpen,
        color: '#f97316',
        key: 'Total Subjects'
    },
    {
        icon: FaShoppingCart,
        color: '#10b981',
        key: 'Total Orders'
    },
    {
        icon: FaMoneyBillWave,
        color: '#3b82f6',
        key: 'Total Revenue'
    }
];

const AdminExploreSection = () => {
    const { analytics, loading, error } = useAdminAnalytic();
    const statusCards = analytics?.statusCards ?? [];
    const monthlyRevenues = analytics?.monthlyRevenues ?? [];
    const currentUsers = analytics?.currentUsers ?? [];
    const userRoleCounts = analytics?.userRoleCounts ?? [];

    const userRoleData = useMemo(() => {
        if (userRoleCounts.length === 0) {
            return [];
        }

        const roleMap = userRoleCounts.reduce<Record<string, number>>((acc, item) => {
            acc[item.role] = item.count;
            return acc;
        }, {});

        return [
            { name: 'Hoc sinh', value: roleMap.STUDENT ?? 0, color: '#9333ea' },
            { name: 'Nguoi ban', value: roleMap.SELLER ?? 0, color: '#f97316' },
            { name: 'Quan tri vien', value: roleMap.SUPER_ADMIN ?? 0, color: '#10b981' }
        ].filter((item) => item.value > 0);
    }, [userRoleCounts]);

    const getCardData = (cardKey: string): IAdminStatusCard | null => {
        if (!Array.isArray(statusCards)) {
            return null;
        }

        return statusCards.find((card) => card.title === cardKey) ?? null;
    };

    if (loading) {
        return (
            <div className={`${styles.adminDashboard} d-flex justify-content-center align-items-center`} style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className={styles.adminDashboard}>
            <Container fluid>
                <div className={`${styles.dashboardHeader} mb-4`}>
                    <h2 className={`${styles.textGradient} fw-bold`}>Trang chu quan tri</h2>
                    <p className={`${styles.mutedText}`}>Chao mung tro lai! Day la nhung gi dang dien ra tren nen tang cua ban.</p>
                </div>

                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                <Row className="g-4 mb-4">
                    {statsData.map((stat, index) => {
                        const cardData = getCardData(stat.key);

                        return (
                            <Col key={index} xs={12} sm={6} lg={3}>
                                <Card className={styles.statCard}>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <p className={styles.statTitle}>{cardData?.title || 'N/A'}</p>
                                                <h3 className={styles.statValue}>
                                                    {stat.key === 'Total Revenue'
                                                        ? `${(cardData?.value || 0).toLocaleString('vi-VN')} VND`
                                                        : (cardData?.value || 0)}
                                                </h3>
                                                <span className={styles.statChange}>
                                                    {cardData?.change ? `+${cardData.change.toFixed(2)}%` : '0%'}
                                                </span>
                                            </div>
                                            <div className={styles.statIcon} style={{ background: `${stat.color}20`, color: stat.color }}>
                                                <stat.icon />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                <Row className="g-4 mb-4">
                    <Col lg={8}>
                        <Card className={styles.chartCard}>
                            <Card.Body>
                                <h5 className={`${styles.cardTitle} mb-4`}>
                                    <FaChartLine className="me-2" />
                                    Doanh thu hang thang (Trieu VND)
                                </h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyRevenues}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                        <XAxis dataKey="month" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                                            labelStyle={{ color: '#fff' }}
                                            itemStyle={{ color: 'var(--bs-secondary)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="url(#colorGradient)"
                                            strokeWidth={3}
                                            dot={{ fill: '#f97316', r: 5 }}
                                        />
                                        <defs>
                                            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#9333ea" />
                                                <stop offset="100%" stopColor="#f97316" />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className={styles.chartCard}>
                            <Card.Body>
                                <h5 className={`${styles.cardTitle} mb-4`}>
                                    <FaUserGraduate className="me-2" />
                                    Phan bo nguoi dung theo vai tro
                                </h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={userRoleData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                        >
                                            {userRoleData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: '#1a1a1a',
                                                border: '1px solid #333'
                                            }}
                                            itemStyle={{
                                                color: 'var(--bs-secondary)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card className={styles.tableCard}>
                            <Card.Body>
                                <h5 className={`${styles.cardTitle} mb-4`}>Nguoi dung gan day</h5>
                                <div className="table-responsive">
                                    <Table hover variant="dark" className={styles.customTable}>
                                        <thead>
                                            <tr>
                                                <th>Ten</th>
                                                <th>Email</th>
                                                <th>Vai tro</th>
                                                <th>Trang thai</th>
                                                <th>Ngay tham gia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentUsers.length > 0 ? (
                                                currentUsers.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="fw-semibold">{user.name}</td>
                                                        <td className="text-white">{user.email}</td>
                                                        <td>
                                                            <Badge bg={user.role === 'SELLER' ? 'warning' : user.role === 'SUPER_ADMIN' ? 'danger' : 'info'}>
                                                                {user.role}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <Badge bg={user.status === 'Active' ? 'success' : 'secondary'}>
                                                                {user.status}
                                                            </Badge>
                                                        </td>
                                                        <td>{new Date(user.joinDate).toLocaleDateString('vi-VN')}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-muted">
                                                        Khong co du lieu nguoi dung
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminExploreSection;
