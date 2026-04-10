import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDeleteSellerSubject } from "../../../hooks/useSubject";

interface DeleteConfirmModalProps {
    show: boolean;
    onHide: () => void;
    quizId: number | null;
    onDeleteSuccess: () => void;
}

const DeleteConfirmModal = ({ show, onHide, quizId, onDeleteSuccess }: DeleteConfirmModalProps) => {
    const { deleteById, loading } = useDeleteSellerSubject();

    const handleDelete = async () => {
        if (!quizId) {
            return;
        }

        try {
            const response = await deleteById(quizId);
            if (response.statusCode === 200) {
                toast.success("Xoa thanh cong");
                onDeleteSuccess();
                onHide();
            } else {
                toast.error("Xoa that bai");
            }
        } catch (error) {
            console.error("Delete subject error:", error);
            toast.error("Xoa that bai");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Ban co chac chan muon xoa?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Sau khi xoa se khong the khoi phuc lai</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Huy
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={loading}>
                    Xoa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmModal;
