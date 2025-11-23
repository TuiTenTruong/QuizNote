import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { LinearGradient } from 'react-text-gradients'
import './header.scss'
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { doLogout } from '../../redux/action/userAction';
import axiosInstance from '../../utils/axiosCustomize';
import defaultImage from '../../assets/upload/users/default-avatar.png';

const Header = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.user.isauthenticated);
    const account = useSelector(state => state.user.account);

    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/users/";
    const userAvatarSrc = account.image ? `${backendBaseURL}${account.image.startsWith('/') ? account.image.substring(1) : account.image}` : defaultImage;
    console.log("User Avatar Src:", userAvatarSrc);
    return (
        <div className='header-content'>
            <Navbar bg="dark" variant="dark" expand="lg" className="px-4 py-3">
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    <LinearGradient gradient={['to left', '#ff6754 ,#5813c1']}>
                        QuizNote
                    </LinearGradient>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <NavLink className='nav-link mx-2 text-white' to="/student">Môn học</NavLink>
                        <NavLink className='nav-link mx-2 text-white' to="/student/weekly-quiz">Môn học tuần</NavLink>
                        <NavLink className='nav-link mx-2 text-white' to="/rewards">Phần thưởng</NavLink>
                        <NavLink className='nav-link mx-2 text-white' to="/about">Giới thiệu</NavLink>
                    </Nav>
                    {!isAuthenticated ? (
                        <><Button as={Link} to="/login" variant="light" className="me-2">Đăng nhập</Button>
                            <Button as={Link} to="/register" variant="gradient" className="bg-primary border-0 px-3">Đăng ký</Button>
                        </>
                    ) : (
                        <>
                            <div className="d-flex align-items-center">
                                <img src={userAvatarSrc} alt={account.username} className="rounded-circle me-2" width="40" height="40" />
                                <NavDropdown title={account.username} id="basic-nav-dropdown" className='text-white'>
                                    <NavDropdown.Item as={Link} to="/student/settings">Hồ sơ</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} onClick={() => dispatch(doLogout())}>Đăng xuất</NavDropdown.Item>
                                </NavDropdown>
                            </div>
                        </>
                    )}

                </Navbar.Collapse>
            </Navbar>
        </div>
    )

}

export default Header;