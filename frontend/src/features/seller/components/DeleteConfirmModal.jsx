import { Modal, Button } from "react-bootstrap";
import { deleteSubject } from "../../../services/apiService";
import { toast } from "react-toastify";

const DeleteConfirmModal = ({ show, onHide, quizId, onDeleteSuccess }) => {

    const handleDelete = async () => {
        if (!quizId) return;
        try {
            const response = await deleteSubject(quizId);
            if (response.statusCode === 200) {
                toast.success("Xóa thành công.");
                onDeleteSuccess();
            } else {
                toast.error("Xóa thất bại.");
                console.log("Delete subject error: ", response);
            }
        } catch (error) {
            toast.error("Xóa thất bại.");
            console.error("Delete subject error: ", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Bạn có chắc chắn muốn xóa?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Sau khi xóa sẽ không thể khôi phục lại</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteConfirmModal;
