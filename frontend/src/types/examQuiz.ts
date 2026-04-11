export interface RootState {
    user?: {
        account?: {
            id?: number;
        } | null;
    };
}

export interface QuizLocationState {
    quizId?: number;
    duration?: number;
    numberOfQuestions?: number;
}

export interface OptionViewModel {
    id: number;
    content: string;
    isCorrect: boolean;
}

export interface QuestionViewModel {
    id: number;
    text: string;
    imageUrl?: string;
    type: string;
    options: OptionViewModel[];
    correctOptionId?: number;
    correctCount: number;
    chapterName: string | null;
}

export interface QuizDataViewModel {
    totalQuestions: number;
    questions: QuestionViewModel[];
}

export type AnswerValue = number | number[] | null;

export interface SavedExamState {
    quizData: QuizDataViewModel;
    answers: AnswerValue[];
    flaggedQuestions: boolean[];
    tempMultipleChoiceAnswers: number[][];
    startTime: number;
    endTime: number;
    submissionId: number;
    currentPage: number;
}

export interface SubmissionAnswerPayload {
    questionId: number;
    selectedOptionId?: number;
    selectedOptionIds?: number[];
}

export interface ImageModalState {
    show: boolean;
    url: string;
}

export interface BadgeTimeProps {
    time: string;
}
