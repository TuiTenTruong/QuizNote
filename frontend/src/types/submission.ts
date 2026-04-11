import { IQuestion } from "./question";
import { ISubject } from "./subject";
import { IResBase } from "./api";

export type SubmissionStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';

export type SubmissionMode = 'PRACTICE' | 'EXAM';

export interface ISubmissionAnswer {
    questionId: number;
    selectedOptionId?: number;
    selectedOptionIds?: number[];
    isCorrect?: boolean;
}

export interface ISubmissionQuestion extends IQuestion {
    userAnswer?: number;
    isCorrect?: boolean;
}

export interface ISubmission {
    id: number;
    userId: number;
    subjectId: number;
    currentSubject: ISubject;
    status: SubmissionStatus;
    mode?: SubmissionMode;
    isPractice: boolean;
    duration: number;
    timeSpent?: number;
    score?: number;
    percentage?: number;
    totalQuestions?: number;
    correctCount?: number;
    startedAt: string;
    endTime?: string;
    submittedAt?: string;
    answers?: ISubmissionAnswer[];
    questions?: ISubmissionQuestion[];
}

export interface IReqStartSubmission {
    userId: number;
    subjectId: number;
    duration: number;
    isPractice: boolean;
}

export interface IReqSubmitAnswerDTO {
    questionId: number;
    selectedOptionIds?: number[];
    selectedOptionId?: number;
}

export type IReqSubmitQuiz = IReqSubmitAnswerDTO[];


export interface IResStartSubmission extends IResBase<ISubmission> { }

export interface IResSubmitQuiz extends IResBase<ISubmission> { }

export interface IResGetHistory extends IResBase<ISubmission[], string> { }

export interface IResGetSubmissionDetail extends IResBase<ISubmission, string> { }
