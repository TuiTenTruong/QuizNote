import { Modal, Button } from "react-bootstrap";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            centered
            className="weekly-quiz-modal" // Sử dụng class chung để có theme tối
        >
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title className="fw-semibold">Xác nhận xóa</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                Bạn có chắc chắn muốn xóa mục này không?
                Sau khi xóa tất cả bài làm liên quan sẽ bị mất.
                Số xu người dùng đã nhận vẫn giữ nguyên.
            </Modal.Body>
            <Modal.Footer className="bg-dark text-light border-secondary">
                <Button variant="outline-secondary" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmModal;