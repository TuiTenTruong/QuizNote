import { IResBase } from "./api";
import { IPaginationMeta } from "./pagination";

export interface IComment {
    id: number;
    content: string;
    rating: number | null;
    userEmail: string;
    subjectName: string;
    createdAt: string;
    replies: IComment[];
    user: ICommentUser;
}

export interface ICommentUser {
    name: string;
    avatarUrl: string;
}

export interface IReqCreateComment {
    content: string;
    rating?: number | null;
    subjectName: string;
}

export interface IReqUpdateComment {
    id: number;
    content?: string;
    rating?: number | null;
}

export interface IReqDeleteComment {
    id: number;
}
export interface ICommentPagination {
    data: IComment[];
    meta: IPaginationMeta
}
export interface IResCreateComment extends IResBase<IComment> { }

export interface IResGetComment extends IResBase<IComment> { }

export interface IResGetComments extends IResBase<ICommentPagination> { }

export interface IResDeleteComment extends IResBase<null, string> { }

export interface IResUpdateComment extends IResBase<IComment> { }
