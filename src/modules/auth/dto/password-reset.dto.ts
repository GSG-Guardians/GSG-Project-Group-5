export interface PasswordResetRequestDto {
  email: string;
}

export interface PasswordResetVerifyDto {
  email: string;
  code: string;
}

export interface PasswordResetConfirmDto {
  resetToken: string;
  newPassword: string;
}
