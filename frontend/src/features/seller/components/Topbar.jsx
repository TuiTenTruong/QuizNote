import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Topbar = () => {
    const navigate = useNavigate();
    return (
        <div className="topbar d-flex justify-content-between align-items-center p-3 px-md-4">
            <InputGroup className="search-bar w-50">
                <InputGroup.Text className="bg-dark border-0 text-light">
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    className="bg-dark text-light border-0"
                />
            </InputGroup>

            <Button variant="primary" className="btn-gradient d-flex align-items-center"
                onClick={() => navigate('/seller/quizzes/create')}>
                <FaPlus className="me-2" /> Create Quiz
            </Button>
        </div>
    );
}

export default Topbar;
