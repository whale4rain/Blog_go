// ============================================================================
// Login Page - User Authentication
// ============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api/user";
import { getCaptcha, sendEmailVerificationCode } from "@/lib/api/comment";
import { useUserStore } from "@/lib/store/userStore";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";

// ----------------------------------------------------------------------------
// Page Component
// ----------------------------------------------------------------------------

export default function LoginPage() {
  const router = useRouter();
  const { login: setUserLogin } = useUserStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Load captcha on mount
  React.useEffect(() => {
    loadCaptcha();
  }, []);

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const loadCaptcha = async () => {
    try {
      const captchaData = await getCaptcha();
      setCaptchaId(captchaData.captcha_id);
      setCaptchaImage(captchaData.pic_path);
    } catch (error) {
      console.error("Failed to load captcha:", error);
    }
  };

  const handleSendCode = async () => {
    if (!registerEmail || !captchaInput) {
      setError("Please enter email and captcha");
      return;
    }

    if (countdown > 0) return;

    try {
      setLoading(true);
      setError("");
      await sendEmailVerificationCode({
        email: registerEmail,
        captcha: captchaInput,
        captcha_id: captchaId,
      });
      setCodeSent(true);
      setCountdown(60);
      alert("Verification code sent to your email!");
    } catch (error: any) {
      setError(error.message || "Failed to send verification code");
      loadCaptcha(); // Reload captcha on error
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !loginPassword) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const userInfo = await login({
        email: loginEmail,
        password: loginPassword,
      });

      setUserLogin(userInfo);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !registerUsername ||
      !registerEmail ||
      !registerPassword ||
      !verificationCode
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const userInfo = await register({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        verification_code: verificationCode,
      });

      setUserLogin(userInfo);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-google-blue/5 via-google-green/5 to-google-yellow/5 flex items-center justify-center p-4">
      {/* Back to Home */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-google-blue transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {/* Login/Register Card */}
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-google-blue to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              IB
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Sign in to access your dashboard"
                : "Join Inspiration Blog today"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-google-red/10 border border-google-red/20 rounded-lg">
              <p className="text-sm text-google-red">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-12 pl-11 pr-4 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-11 pr-11 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full h-12 pl-11 pr-4 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full h-12 pl-11 pr-4 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-12 pl-11 pr-11 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full h-12 pl-11 pr-4 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Captcha
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter captcha"
                    className="flex-1 h-12 px-4 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                    required
                  />
                  {captchaImage && (
                    <img
                      src={captchaImage}
                      alt="Captcha"
                      className="h-12 w-32 border-2 border-border rounded-lg cursor-pointer object-cover"
                      onClick={loadCaptcha}
                    />
                  )}
                </div>
              </div>

              {/* Verification Code */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Verification Code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="flex-1 h-12 px-4 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-google-blue/50 focus:border-google-blue transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={
                      loading ||
                      countdown > 0 ||
                      !registerEmail ||
                      !captchaInput
                    }
                    className="px-6 h-12 border-2 border-google-blue text-google-blue rounded-lg hover:bg-google-blue/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {countdown > 0
                      ? `${countdown}s`
                      : codeSent
                        ? "Resend"
                        : "Send Code"}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-google-blue text-white rounded-lg hover:bg-[hsl(214,90%,48%)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                }}
                className="text-google-blue hover:underline font-medium"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
