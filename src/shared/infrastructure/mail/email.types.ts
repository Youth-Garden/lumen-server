export type EmailTemplateName =
  | 'reset-password'
  | 'verify-email'
  | 'welcome'
  | 'progress-milestone'
  | 'quiz-results'
  | 'achievement-unlocked';

export interface EmailPayload<T = Record<string, unknown>> {
  to: string;
  templateName: EmailTemplateName;
  subject: string;
  data: T;
  cc?: string[];
  bcc?: string[];
}

export interface ResetPasswordData {
  name: string;
  resetLink: string;
  expiresInMinutes: number;
}

export interface VerifyEmailData {
  name: string;
  verificationLink: string;
  expiresInMinutes: number;
}
