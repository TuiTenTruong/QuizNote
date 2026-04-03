import { IResBase } from "./user";

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

export interface IResCreateComment extends IResBase<IComment> { }

export interface IResGetComments extends IResBase<IComment[]> { }

export interface IResDeleteComment extends IResBase<null, string> { }

export interface IResUpdateComment extends IResBase<IComment> { }
