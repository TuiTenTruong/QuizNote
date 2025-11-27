import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import './AdminDashboard.scss';
import { AdminAnalytics } from '../../services/apiService';

const statsData = [
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

const AdminDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch analytics data from API
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const response = await AdminAnalytics();
                setAnalyticsData(response.data);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const { statusCards, monthlyRevenues, currentUsers, userRoleCounts } = analyticsData || {};

    // Prepare user role distribution data from statusCards
    const getUserRoleData = () => {
        if (userRoleCounts != null) {
            // Estimate: Assume orders come from students, remaining are other users
            var students = 0;
            var sellers = 0;
            var admins = 0;
            userRoleCounts.forEach(roleCount => {
                if (roleCount.role === 'STUDENT') {
                    students = roleCount.count;
                } else if (roleCount.role === 'SELLER') {
                    sellers = roleCount.count;
                } else if (roleCount.role === 'SUPER_ADMIN') {
                    admins = roleCount.count;
                }
            });
            return [
                { name: 'Học sinh', value: students, color: '#9333ea' },
                { name: 'Người bán', value: sellers, color: '#f97316' },
                { name: 'Quản trị viên', value: admins > 0 ? admins : 0, color: '#10b981' }
            ].filter(item => item.value > 0);
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <Container fluid>
                {/* Header */}
                <div className="dashboard-header mb-4">
                    <h2 className="text-gradient fw-bold">Trang chủ quản trị</h2>
                    <p className="text-muted">Chào mừng trở lại! Đây là những gì đang diễn ra trên nền tảng của bạn.</p>
                </div>

                {/* Stats Cards */}
                <Row className="g-4 mb-4">
                    {statsData?.map((stat, index) => {
                        const cardData = Array.isArray(statusCards)
                            ? statusCards.find(card => card.title === stat.key)
                            : null;

                        return (
                            <Col key={index} xs={12} sm={6} lg={3}>
                                <Card className="stat-card">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <p className="stat-title">{cardData?.title || 'N/A'}</p>
                                                <h3 className="stat-value">
                                                    {stat.key === 'Total Revenue'
                                                        ? `${(cardData?.value || 0).toLocaleString('vi-VN')} VND`
                                                        : (cardData?.value || 0)
                                                    }
                                                </h3>
                                                <span className="stat-change">
                                                    {cardData?.change ? `+${cardData.change.toFixed(2)}%` : '0%'}
                                                </span>
                                            </div>
                                            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                                                <stat.icon />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {/* Charts Row */}
                <Row className="g-4 mb-4">
                    {/* Revenue Chart */}
                    <Col lg={8}>
                        <Card className="chart-card">
                            <Card.Body>
                                <h5 className="card-title mb-4">
                                    <FaChartLine className="me-2" />
                                    Doanh thu hàng tháng (Triệu VND)
                                </h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyRevenues || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                                        <XAxis dataKey="month" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                                            labelStyle={{ color: '#fff' }}
                                            itemStyle={{
                                                color: 'var(--bs-secondary)'
                                            }}
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

                    {/* User Role Distribution */}
                    <Col lg={4}>
                        <Card className="chart-card">
                            <Card.Body>
                                <h5 className="card-title mb-4">
                                    <FaUserGraduate className="me-2" />
                                    Phân bố người dùng theo vai trò
                                </h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={getUserRoleData()}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                        >
                                            {getUserRoleData()?.map((entry, index) => (
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

                {/* Recent Users Table */}
                <Row>
                    <Col>
                        <Card className="table-card">
                            <Card.Body>
                                <h5 className="card-title mb-4">Người dùng gần đây</h5>
                                <div className="table-responsive">
                                    <Table hover variant="dark" className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Tên</th>
                                                <th>Email</th>
                                                <th>Vai trò</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày tham gia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentUsers && currentUsers.length > 0 ? (
                                                currentUsers?.map((user) => (
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
                                                    <td colSpan="5" className="text-center text-muted">
                                                        Không có dữ liệu người dùng
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

export default AdminDashboard;
