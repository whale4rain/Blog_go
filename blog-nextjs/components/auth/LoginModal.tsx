// ============================================================================
// Login Modal Component - User Authentication Modal
// ============================================================================

"use client";

import { getCaptcha } from "@/lib/api/base";
import {
  login as apiLogin,
  register as apiRegister,
  sendEmailVerificationCode,
} from "@/lib/api/user";
import { useUIStore } from "@/lib/store/uiStore";
import { useUserStore } from "@/lib/store/userStore";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginModal() {
  const { loginModalOpen, closeLoginModal } = useUIStore();
  const { login: storeLogin } = useUserStore();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  // Load captcha on mount
  useEffect(() => {
    if (loginModalOpen) {
      loadCaptcha();
    }
  }, [loginModalOpen, mode]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const loadCaptcha = async () => {
    try {
      const response = await getCaptcha();
      setCaptchaId(response.captcha_id);
      setCaptchaImage(response.pic_path);
    } catch (error) {
      console.error("Failed to load captcha:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate captcha
    if (!captchaInput.trim()) {
      setError("Please enter the captcha");
      setLoading(false);
      return;
    }

    try {
      const userInfo = await apiLogin({
        email: loginEmail,
        password: loginPassword,
        captcha: captchaInput,
        captcha_id: captchaId,
      });

      // Store user data using the store's login method
      storeLogin(userInfo);

      setSuccess("Login successful!");
      // Close modal and navigate to dashboard (use router.push to avoid full reload and make behavior
      // consistent with page login). Small delay keeps UX smooth and ensures response processed.
      setTimeout(() => {
        closeLoginModal();
        router.push("/");
      }, 300);
    } catch (error: any) {
      setError(error.response?.data?.msg || "Login failed. Please try again.");
      loadCaptcha(); // Reload captcha on error
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userInfo = await apiRegister({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        verification_code: verificationCode,
      });

      // Auto-login after successful registration
      storeLogin(userInfo);

      setSuccess("Registration successful! Welcome aboard!");
      setTimeout(() => {
        closeLoginModal();
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      setError(
        error.response?.data?.msg || "Registration failed. Please try again.",
      );
      loadCaptcha(); // Reload captcha on error
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!registerEmail) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await sendEmailVerificationCode({
        email: registerEmail,
        captcha: captchaInput,
        captcha_id: captchaId,
      });
      setSuccess("Verification code sent!");
      setCountdown(60);
    } catch (error: any) {
      setError(error.response?.data?.msg || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterUsername("");
    setVerificationCode("");
    setCaptchaInput("");
    setCaptchaId("");
    setCaptchaImage("");
    setError("");
    setSuccess("");
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    setCountdown(0);
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
    // Reload captcha when switching modes
    setTimeout(() => {
      loadCaptcha();
    }, 100);
  };

  const handleClose = () => {
    closeLoginModal();
    resetForm();
  };

  if (!loginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600 mt-2">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Join our community today"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={mode === "login" ? handleLogin : handleRegister}
          className="px-8 py-6"
        >
          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {mode === "login" ? (
            // Login Form
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Captcha
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                    placeholder="Enter captcha"
                    required
                  />
                  <img
                    src={captchaImage}
                    alt="Captcha"
                    className="h-10 w-24 border border-gray-300 rounded cursor-pointer"
                    onClick={loadCaptcha}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          ) : (
            // Register Form
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Verification Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                    placeholder="Enter code"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading || countdown > 0 || !registerEmail}
                    className="px-4 py-2 border border-google-blue text-google-blue rounded-lg hover:bg-google-blue/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : "Send Code"}
                  </button>
                </div>
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Captcha
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue"
                    placeholder="Enter captcha"
                    required
                  />
                  <img
                    src={captchaImage}
                    alt="Captcha"
                    className="h-10 w-24 border border-gray-300 rounded cursor-pointer"
                    onClick={loadCaptcha}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          )}

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={switchMode}
              className="text-google-blue hover:underline font-medium"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
