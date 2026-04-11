import type { IComment } from "./comment";

export interface CommentMeta {
    pages?: number;
    total?: number;
    last?: boolean;
}

export interface CommentPagePayload {
    result?: IComment[];
    meta?: CommentMeta;
}
