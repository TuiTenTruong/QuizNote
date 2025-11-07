import { useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
const NavigateHomeButton = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    };

    return (
        <button onClick={handleClick} className="btn btn-outline-dark text-white px-2 pb-2">
            <IoHomeOutline className="p-0" />
        </button>
    );
};
export default NavigateHomeButton;