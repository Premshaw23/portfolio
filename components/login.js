"use client";
import React, { useState } from "react";
import {
  auth,
  googleProvider,
  githubProvider,
  applyPersistence,
} from "@/lib/firebase";
import { useLoader } from "@/context/LoaderContext";
import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast, Bounce } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [name, setName] = useState("");

  const router = useRouter();

  const { showLoader, hideLoader, loading } = useLoader();
  const toastConfig = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    transition: Bounce,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    let user = null;

    try {
      showLoader();
      await applyPersistence(rememberMe);

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        await auth.currentUser.reload();

        if (!auth.currentUser.emailVerified) {
          toast.warning(
            "Please verify your email before logging in.",
            toastConfig
          );
          await signOut(auth);
          router.push("/verify-email");
          return;
        }

        user = userCredential.user;
        toast.success("Logged in successfully!", toastConfig);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;
        await updateProfile(user, {
          displayName: name,
        });
        await sendEmailVerification(user);
        toast.info(
          "Verification email sent. Please check your inbox.",
          toastConfig
        );
        router.push("/verify-email");
        return;
      }

      setEmail("");
      setPassword("");

      if (user?.uid === ADMIN_UID || user?.email === ADMIN_EMAIL) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message, toastConfig);
    } finally {
      hideLoader();
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError(null);
    try {
      showLoader();
      await applyPersistence(rememberMe);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      toast.success(`Welcome ${user.displayName || "User"}!`, toastConfig);

      if (user.uid === ADMIN_UID || user.email === ADMIN_EMAIL) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);
        toast.info(
          `Account exists with a different sign-in method: ${methods.join(
            ", "
          )}`,
          toastConfig
        );
      } else {
        setError(error.message);
        toast.error(error.message, toastConfig);
      }
    } finally {
      hideLoader();
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning("Please enter your email first.", toastConfig);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!", toastConfig);
    } catch (err) {
      toast.error(err.message, toastConfig);
    }
  };

  return (
    <>
      {" "}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white mx-5 dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </motion.h1>
            <p className="text-purple-100 text-sm">
              {isLogin
                ? "Sign in to continue your journey"
                : "Join us and start exploring"}
            </p>
          </div>

          <div className="p-8">
            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    name="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition focus:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                    Remember me
                  </span>
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition duration-200
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/50"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            {/* Toggle Auth Mode */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin((prev) => !prev);
                  setError(null);
                }}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                OR
              </span>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuthLogin(googleProvider)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition duration-200 shadow-sm"
              >
                <FaGoogle className="text-red-500" size={20} />
                Continue with Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuthLogin(githubProvider)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 dark:bg-gray-700 border-2 border-gray-900 dark:border-gray-600 rounded-xl text-white font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition duration-200 shadow-sm"
              >
                <FaGithub size={20} />
                Continue with GitHub
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </>
  );
}
