// Re-export all API modules
export * as authApi from './auth.api';
export * as userApi from './user.api';
export * as subjectApi from './subject.api';
export * as questionApi from './question.api';
export * as commentApi from './comment.api';
export * as submissionApi from './submission.api';
export * as analyticsApi from './analytics.api';
export * as orderApi from './order.api';
export * as walletApi from './wallet.api';
export * as roleApi from './role.api';
export * as weeklyQuizApi from './weeklyQuiz.api';
export * as rewardApi from './reward.api';
export * as paymentApi from './payment.api';

// Re-export client instance
export { default as apiClient } from './client';
export { setNavigate } from './client';
