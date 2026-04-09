import { IQuestion, IQuestionOption } from "./question";
import { IResBase } from "./api";

export type WeeklyQuizStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED';

export interface IWeeklyQuizQuestion {
    id: number;
    content: string;
    imageUrl?: string;
    options: IQuestionOption[];
}

export interface IWeeklyQuiz {
    id: number;
    title: string;
    description?: string;
    durationMinutes: number;
    startDate: string;
    endDate: string;
    status: WeeklyQuizStatus;
    coinsReward: number;
    questions: IWeeklyQuizQuestion[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IWeeklyQuizUserStatus {
    hasPlayed: boolean;
    score?: number;
    accuracyPercent?: number;
    coinsEarned?: number;
    submittedAt?: string;
}

export interface IWeeklyQuizSubmitAnswer {
    questionId: number;
    selectedOptionId: number;
}

export interface IWeeklyQuizSubmitData {
    weeklyQuizId: number;
    answers: Record<any, number>;
    timeTaken: number;

}

export interface IWeeklyQuizResult {
    score: number;
    percent: number;
    coins: number;
    correctCount?: number;
    totalQuestions?: number;
    bonusSteak: number;
    currentStreak?: number;
}

export interface IReqCreateWeeklyQuiz {
    title: string;
    description?: string;
    durationMinutes: number;
    startDate: string;
    endDate: string;
    coinsReward: number;
}

export interface IReqUpdateWeeklyQuiz extends Partial<IReqCreateWeeklyQuiz> {
    id: number;
}

export interface IResGetCurrentWeeklyQuiz extends IResBase<IWeeklyQuiz, string> { }

export interface IResGetWeeklyQuizStatus extends IResBase<IWeeklyQuizUserStatus, string> { }

export interface IResSubmitWeeklyQuiz extends IResBase<IWeeklyQuizResult> { }

export interface IResGetAllWeeklyQuizzes extends IResBase<IWeeklyQuiz[], string> { }

export interface IResCreateWeeklyQuiz extends IResBase<IWeeklyQuiz> { }

export interface IResUpdateWeeklyQuiz extends IResBase<IWeeklyQuiz> { }

export interface IResDeleteWeeklyQuiz extends IResBase<null, string> { }
