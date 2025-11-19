import React from 'react';
import { Badge, Button, Form } from 'react-bootstrap';
import axiosInstance from "../../../utils/axiosCustomize";
import { FaReply } from 'react-icons/fa';

const ReviewItem = ({
    review,
    isReply = false,
    canReply = false,
    replyingTo = null,
    replyContent = "",
    onReplyClick = null,
    onCancelReply = null,
    onSubmitReply = null,
    onReplyContentChange = null
}) => {
    const backendBaseUserURL = axiosInstance.defaults.baseURL + "storage/users/";

    // Check if the user is the author/seller
    const isSeller = review.user.role && (review.user.role.name === 'SELLER' || review.user.role.name === 'SUPER_ADMIN');

    // Check if this review already has a reply from seller
    const hasSellerReply = review.replies != [];

    // Only show reply button if seller hasn't replied yet
    const showReplyButton = canReply && !isReply && !hasSellerReply;

    return (
        <div className={`review-item ${isReply ? 'ms-4 mt-3' : 'mb-3'}`}>
            <div className="d-flex align-items-start">
                {review.user.avatarUrl && (
                    <img
                        src={backendBaseUserURL + review.user.avatarUrl}
                        alt={review.user.name}
                        className="rounded-circle me-3"
                        width={40}
                        height={40}
                    />
                )}
                <div className="w-100">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h6 className="fw-semibold text-secondary mb-0">{review.user.name}</h6>
                            {isSeller && <Badge bg="info" size="sm" className="ms-2">Chủ shop</Badge>}
                        </div>
                        {review.rating > 0 && (
                            <span className="text-warning small">
                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </span>
                        )}
                    </div>
                    <p className="text-white small mb-1 mt-1">{review.content}</p>
                    <small className="text-secondary">{new Date(review.createdAt).toLocaleString('vi-VN')}</small>

                    {showReplyButton && (
                        <div className="mt-2 ms-4">
                            {replyingTo === review.id ? (
                                <div className="reply-form">
                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Nhập phản hồi của bạn..."
                                            value={replyContent}
                                            onChange={(e) => onReplyContentChange(e.target.value)}
                                            className="bg-secondary text-light border-0"
                                        />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => onSubmitReply(review.id)}
                                        >
                                            Gửi
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={onCancelReply}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-secondary p-0"
                                    onClick={() => onReplyClick(review.id)}
                                >
                                    <FaReply className="me-1" /> Phản hồi
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Recursive rendering for replies */}
            {review.replies && review.replies.length > 0 && (
                <div className="replies-container mt-2">
                    {review.replies.map(reply => (
                        <ReviewItem
                            key={reply.id}
                            review={reply}
                            isReply={true}
                            canReply={false}
                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            onReplyClick={onReplyClick}
                            onCancelReply={onCancelReply}
                            onSubmitReply={onSubmitReply}
                            onReplyContentChange={onReplyContentChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
