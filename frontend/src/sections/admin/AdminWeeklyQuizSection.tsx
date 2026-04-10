import React from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Form,
    InputGroup,
    Modal,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import {
    FaCalendarAlt,
    FaEdit,
    FaImage,
    FaPlus,
    FaTrash,
} from "react-icons/fa";
import { useAdminWeeklyQuiz } from "../../hooks/useWeeklyQuiz";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import "./scss/AdminWeeklyQuizSection.scss";

const AdminWeeklyQuizSection = () => {
    const {
        weeklyQuizzes,
        loading,
        showModal,
        editMode,
        showDeleteConfirm,
        formData,
        setFormData,
        handleOpenModal,
        handleCloseModal,
        handleQuestionChange,
        handleQuestionFileChange,
        handleOptionChange,
        handleSubmit,
        handleDeleteClick,
        handleCloseDeleteConfirm,
        handleConfirmDelete,
        formatRange,
    } = useAdminWeeklyQuiz();

    return (
        <div className="admin-weekly-quiz-page">
            <Container fluid>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-gradient mb-1">Quan ly Weekly Quiz</h2>
                        <p className="text-muted mb-0">
                            Tao va quan ly cac bai Weekly Quiz de hoc vien lam moi tuan mot lan.
                        </p>
                    </div>
                    <Button className="btn-gradient" onClick={() => void handleOpenModal()}>
                        <FaPlus className="me-2" />
                        Tao Weekly Quiz
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-5 text-light">
                        <Spinner animation="border" variant="light" />
                    </div>
                ) : (
                    <Card className="weekly-table-card bg-dark text-light border-0 shadow-sm">
                        <Card.Body>
                            <Table
                                hover
                                responsive
                                variant="dark"
                                className="align-middle weekly-table"
                            >
                                <thead>
                                    <tr>
                                        <th>Tuan</th>
                                        <th>Tieu de</th>
                                        <th>Thoi gian</th>
                                        <th>Do kho</th>
                                        <th>Trang thai</th>
                                        <th className="text-end">Thao tac</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weeklyQuizzes.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center text-secondary py-4">
                                                Chua co weekly quiz nao
                                            </td>
                                        </tr>
                                    ) : (
                                        weeklyQuizzes.map((quiz) => (
                                            <tr key={quiz.id}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="calendar-icon">
                                                            <FaCalendarAlt />
                                                        </span>
                                                        <div>
                                                            <div className="fw-semibold">
                                                                Week {quiz.weekNumber} - {quiz.year}
                                                            </div>
                                                            <small className="text-secondary">
                                                                ID: {quiz.id}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold">{quiz.title}</div>
                                                    {quiz.description && (
                                                        <small className="text-secondary d-block text-truncate w-75">
                                                            {quiz.description}
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-secondary">
                                                        {formatRange(quiz.startDate, quiz.endDate)}
                                                    </small>
                                                </td>
                                                <td>
                                                    <Badge bg="info" pill>
                                                        {quiz.difficulty}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {quiz.active ? (
                                                        <Badge bg="success" pill>
                                                            Dang hoat dong
                                                        </Badge>
                                                    ) : (
                                                        <Badge bg="secondary" pill>
                                                            Khong hoat dong
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="text-end">
                                                    <Button
                                                        variant="outline-warning"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => void handleOpenModal(quiz)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(quiz.id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                )}

                <DeleteConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={handleCloseDeleteConfirm}
                    onConfirm={() => void handleConfirmDelete()}
                />

                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    size="lg"
                    centered
                    className="weekly-quiz-modal"
                >
                    <Modal.Header closeButton className="bg-dark text-light border-0">
                        <Modal.Title className="fw-semibold">
                            {editMode ? "Chinh sua Weekly Quiz" : "Tao Weekly Quiz moi"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-light">
                        <Form onSubmit={(event) => void handleSubmit(event)}>
                            <Row className="g-3">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Tieu de</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                            placeholder="Nhap tieu de"
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Mo ta</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="bg-dark text-light"
                                            placeholder="Nhap mo ta"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Nam</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.year}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    year: Number.parseInt(e.target.value, 10) || formData.year,
                                                })
                                            }
                                            min="2024"
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Tuan</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.weekNumber}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    weekNumber: Number.parseInt(e.target.value, 10) || formData.weekNumber,
                                                })
                                            }
                                            min="1"
                                            max="53"
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Do kho</Form.Label>
                                        <Form.Select
                                            value={formData.difficulty}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    difficulty: e.target.value,
                                                })
                                            }
                                            className="bg-dark text-light"
                                        >
                                            <option>De</option>
                                            <option>Trung binh</option>
                                            <option>Kho</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ngay bat dau</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, startDate: e.target.value })
                                            }
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Ngay ket thuc</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={formData.endDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, endDate: e.target.value })
                                            }
                                            required
                                            className="bg-dark text-light"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="questions-section mt-4">
                                <h5 className="mb-3 fw-semibold">Tao 10 cau hoi</h5>
                                <div className="questions-container">
                                    {formData.questions.map((question, qIndex) => (
                                        <Card key={qIndex} className="question-card mb-3 bg-dark text-light">
                                            <Card.Header className="d-flex justify-content-between align-items-center bg-question-header">
                                                <strong>Cau {qIndex + 1}</strong>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Noi dung cau hoi *</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        value={question.content}
                                                        onChange={(e) =>
                                                            handleQuestionChange(qIndex, "content", e.target.value)
                                                        }
                                                        placeholder="Nhap noi dung cau hoi..."
                                                        required
                                                        className="bg-dark text-light"
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3">
                                                    <Form.Label>Hinh anh cau hoi</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text className="bg-dark border-secondary text-light">
                                                            <FaImage />
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleQuestionFileChange(qIndex, e)}
                                                            className="bg-dark text-light border-secondary"
                                                        />
                                                    </InputGroup>
                                                    {question.imageFile && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={URL.createObjectURL(question.imageFile)}
                                                                alt="Preview"
                                                                className="img-fluid rounded"
                                                                style={{ maxHeight: "150px" }}
                                                            />
                                                        </div>
                                                    )}
                                                    {!question.imageFile && question.imagePreview && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={question.imagePreview}
                                                                alt="Current"
                                                                className="img-fluid rounded"
                                                                style={{ maxHeight: "150px" }}
                                                            />
                                                        </div>
                                                    )}
                                                </Form.Group>

                                                <Form.Label>Dap an (chon 1 dap an dung) *</Form.Label>
                                                {question.options.map((option, optIndex) => (
                                                    <div key={optIndex} className="option-input-group mb-2">
                                                        <Row className="g-2">
                                                            <Col xs={1} className="d-flex align-items-center">
                                                                <Form.Check
                                                                    type="radio"
                                                                    name={`question-${qIndex}-correct`}
                                                                    checked={option.isCorrect}
                                                                    onChange={(e) =>
                                                                        handleOptionChange(
                                                                            qIndex,
                                                                            optIndex,
                                                                            "isCorrect",
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col xs={11}>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={option.content}
                                                                    onChange={(e) =>
                                                                        handleOptionChange(
                                                                            qIndex,
                                                                            optIndex,
                                                                            "content",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder={`Dap an ${String.fromCharCode(65 + optIndex)}`}
                                                                    className="bg-dark text-light"
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ))}
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <Button variant="outline-secondary" onClick={handleCloseModal}>
                                    Huy
                                </Button>
                                <Button type="submit" className="btn-gradient">
                                    {editMode ? "Cap nhat" : "Tao moi"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default AdminWeeklyQuizSection;
