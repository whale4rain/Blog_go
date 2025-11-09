// ============================================================================
// Base API Functions
// ============================================================================

import type { CaptchaResponse } from "@/types";
import { get, post } from "./client";

// ----------------------------------------------------------------------------
// Captcha and Verification
// ----------------------------------------------------------------------------

/**
 * Get captcha for login/registration
 */
export async function getCaptcha(): Promise<CaptchaResponse> {
  return post<CaptchaResponse>("/base/captcha");
}

/**
 * Send email verification code
 */
export async function sendEmailVerificationCode(data: {
  email: string;
  captcha: string;
  captcha_id: string;
}): Promise<void> {
  return post<void>("/base/sendEmailVerificationCode", data);
}

/**
 * Get QQ login URL
 */
export async function getQQLoginURL(): Promise<string> {
  return get<string>("/base/qqLoginURL");
}
