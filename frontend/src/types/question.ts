import { IPaginationMeta } from "./pagination";
import { IResBase } from "./user";

export interface IQuestion {
    id: number;
    content: string;
    type: QuestionTypeEnum;
    imageUrl?: string;
    explanation?: string;
    subjectId: number;
    chapter: IQuestionChapter;
    correctnessPercentage: number;
    options: IQuestionOption[];
}

export type QuestionTypeEnum = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export interface IQuestionOption {
    id: number;
    content: string;
    isCorrect: boolean;
    optionOrder: number;
}

export interface IQuestionChapter {
    id: number;
    name: string;
}

export interface IQuestionPagination {
    meta: IPaginationMeta;
    result: IQuestion[];
}

export interface IReqCreateQuestion extends Omit<IQuestion, 'id' | 'correctnessPercentage' | 'chapter' | 'options'> {
}

export interface IReqUpdateQuestion extends Partial<IReqCreateQuestion> {
    id: number;
    options?: IQuestionOption[];
}

export interface IResCreateQuestion extends IResBase<IQuestion> { }

export interface IResUpdateQuestion extends IResBase<IQuestion> { }

export interface IResGetQuestions extends IResBase<IQuestionPagination, string> { }

export interface IResDeleteQuestion extends IResBase<null, string> { }