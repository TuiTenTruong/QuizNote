import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinearGradient } from 'react-text-gradients'
import './header.scss'
import { Link, NavLink } from 'react-router-dom';
const Header = () => {
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
                        <NavLink className='nav-link mx-2 text-white' to="/quiz">Quiz</NavLink>
                        <NavLink className='nav-link mx-2 text-white' to="/weekly">Weekly Quiz</NavLink>
                        <NavLink className='nav-link mx-2 text-white' to="/rewards">Rewards</NavLink>
                        <NavLink className='nav-link mx-2 text-white' to="/about">About</NavLink>
                    </Nav>
                    <Button as={Link} to="/login" variant="light" className="me-2">Sign In</Button>
                    <Button as={Link} to="/register" variant="gradient" className="bg-primary border-0 px-3">Register</Button>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )

}

export default Header;