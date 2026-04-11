export interface ReviewUserRole {
    name?: string;
}

export interface ReviewUser {
    name: string;
    avatarUrl?: string;
    role?: ReviewUserRole;
}

export interface ReviewData {
    id: number;
    content: string;
    rating?: number | null;
    createdAt: string;
    user: ReviewUser;
    replies?: ReviewData[];
}

export interface ReviewItemProps {
    review: ReviewData;
    isReply?: boolean;
    canReply?: boolean;
    replyingTo?: number | null;
    replyContent?: string;
    onReplyClick?: (reviewId: number) => void;
    onCancelReply?: () => void;
    onSubmitReply?: (reviewId: number) => void | Promise<void>;
    onReplyContentChange?: (value: string) => void;
}
