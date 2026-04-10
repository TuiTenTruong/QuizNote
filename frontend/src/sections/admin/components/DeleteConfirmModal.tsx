import { Button, Modal } from "react-bootstrap";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) => {
    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            centered
            className="weekly-quiz-modal"
        >
            <Modal.Header closeButton className="bg-dark text-light border-secondary">
                <Modal.Title className="fw-semibold">Xac nhan xoa</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light">
                Ban co chac chan muon xoa muc nay khong?
                Sau khi xoa tat ca bai lam lien quan se bi mat.
                So xu nguoi dung da nhan van giu nguyen.
            </Modal.Body>
            <Modal.Footer className="bg-dark text-light border-secondary">
                <Button variant="outline-secondary" onClick={onClose}>
                    Huy
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Xoa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmModal;
