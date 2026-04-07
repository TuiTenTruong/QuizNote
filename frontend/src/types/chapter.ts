import { IResBase } from "./api";

export interface IChapter {
    id: number;
    name: string;
    subjectId: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface IReqCreateChapter {
    name: string;
    subjectId: number;
}

export interface IReqUpdateChapter {
    id: number;
    name?: string;
}

export interface IResCreateChapter extends IResBase<IChapter> { }

export interface IResUpdateChapter extends IResBase<IChapter> { }

export interface IResGetChapters extends IResBase<IChapter[], string> { }

export interface IResDeleteChapter extends IResBase<null, string> { }