// ============================================================================
// Base API Functions
// ============================================================================

import { get, post } from "./client";
import { USE_MOCK_API, mockApi } from "./mock/index";
import type { CaptchaResponse } from "@/types";

// ----------------------------------------------------------------------------
// Captcha and Verification
// ----------------------------------------------------------------------------

/**
 * Get captcha for login/registration
 */
export async function getCaptcha(): Promise<CaptchaResponse> {
  if (USE_MOCK_API) {
    return mockApi.getCaptcha();
  }
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
  if (USE_MOCK_API) {
    return mockApi.sendEmailVerificationCode(data.email);
  }
  return post<void>("/base/sendEmailVerificationCode", data);
}

/**
 * Get QQ login URL
 */
export async function getQQLoginURL(): Promise<string> {
  return get<string>("/base/qqLoginURL");
}
