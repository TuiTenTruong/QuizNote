import { IResBase } from './api';
import { IPaginationMeta } from './pagination';
import { IUser } from './user';

export type SubjectStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED' | 'DRAFT';
export type AdminSubjectFilterStatus = 'All' | SubjectStatus;
export type AdminSubjectModalType = '' | 'view' | 'approve' | 'reject' | 'delete';

export interface ISubject {
    id: number;
    name: string;
    description: string;
    price: number;
    status: SubjectStatus;
    color: string;
    time: number;
    averageRating: number | null;
    ratingCount: number;
    purchaseCount: number;
    highestScore: number | null;
    questionCount: number;
    imageUrl: string;
    createUser: IUser;
    createdAt: string;
    updatedAt: string;
}

export interface QuizItem {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    purchasedAt?: string;
    createUser?: {
        username?: string;
    };
    averageRating?: number;
    questionCount?: number;
}

export interface ISubjectPagination {
    meta: IPaginationMeta;
    result: ISubject[];
}

export interface IReqCreateSubject extends Pick<ISubject, 'name' | 'description' | 'price' | 'status'> { }

export interface IReqUpdateSubject extends Partial<IReqCreateSubject> {
    id: number;
}

export interface IResCreateSubject extends IResBase<ISubject> { }

export interface IResUpdateSubject extends IResBase<ISubject> { }

export interface IResGetMyQuizzes extends IResBase<QuizItem[], string> { }

export interface IResGetSubjects extends IResBase<ISubjectPagination, string> { }

export interface IResDeleteSubject extends IResBase<null, string> { }

