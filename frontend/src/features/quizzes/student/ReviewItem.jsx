import React from 'react';
import { Badge } from 'react-bootstrap';
import axiosInstance from "../../../utils/axiosCustomize";

const ReviewItem = ({ review, isReply = false }) => {
    const backendBaseUserURL = axiosInstance.defaults.baseURL + "storage/users/";

    // Check if the user is the author/seller
    const isSeller = review.user.role && (review.user.role.name === 'SELLER' || review.user.role.name === 'SUPER_ADMIN');

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
                            <h6 className="fw-semibold mb-0">{review.user.name}</h6>
                            {isSeller && <Badge bg="info" size="sm" className="ms-2">Chủ shop</Badge>}
                        </div>
                        {review.rating > 0 && (
                            <span className="text-warning small">
                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </span>
                        )}
                    </div>
                    <p className="text-secondary small mb-1 mt-1">{review.content}</p>
                    <small className="text-secondary">{new Date(review.createdAt).toLocaleString('vi-VN')}</small>
                </div>
            </div>

            {/* Recursive rendering for replies */}
            {review.replies && review.replies.length > 0 && (
                <div className="replies-container mt-2">
                    {review.replies.map(reply => (
                        <ReviewItem key={reply.id} review={reply} isReply={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
