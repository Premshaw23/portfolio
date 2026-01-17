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
import { toast } from "react-hot-toast"; // Switching to hot-toast for better consistency
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ShieldCheck, Sparkles, ArrowRight, Github } from "lucide-react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    let user = null;

    try {
      showLoader();
      await applyPersistence(rememberMe);

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await auth.currentUser.reload();

        if (!auth.currentUser.emailVerified) {
          toast.error("Please verify your email before logging in.");
          await signOut(auth);
          router.push("/verify-email");
          return;
        }

        user = userCredential.user;
        toast.success("Welcome back!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await sendEmailVerification(user);
        toast.success("Verification email sent! Check your inbox.");
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
      toast.error(err.message);
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

      toast.success(`Welcome, ${user.displayName || "Explorer"}!`);

      if (user.uid === ADMIN_UID || user.email === ADMIN_EMAIL) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error("An account already exists with these credentials.");
      } else {
        setError(error.message);
        toast.error(error.message);
      }
    } finally {
      hideLoader();
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset instructions sent to your email!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="relative w-full max-w-[500px] px-4 sm:px-6">
      {/* Background Decorative Element */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-500/15 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Immersive Header */}
        <div className="relative px-8 pt-10 pb-6 text-center">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 mb-6"
          >
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Access Point</span>
          </motion.div>
          
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
            {isLogin ? "Hello Again." : "Begin Journey."}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {isLogin ? "Enter your credentials to continue." : "Create your unique profile signature."}
          </p>
        </div>

        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-4">Full Identity</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="e.g., John Doe"
                      className="w-full pl-12 pr-6 py-4 rounded-[1.25rem] bg-gray-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white text-sm transition-all focus:ring-4 focus:ring-indigo-500/10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-4">Email Channel</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  className="w-full pl-12 pr-6 py-4 rounded-[1.25rem] bg-gray-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white text-sm transition-all focus:ring-4 focus:ring-indigo-500/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Security Key</label>
                {isLogin && (
                  <button type="button" onClick={handleForgotPassword} className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600">Recovery</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-4 rounded-[1.25rem] bg-gray-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white text-sm transition-all focus:ring-4 focus:ring-indigo-500/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer hidden"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-gray-200 dark:border-white/10 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all flex items-center justify-center">
                    <ShieldCheck size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Safe Session</span>
              </label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-[1rem] flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-4 rounded-[1.25rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Authenticate" : "Register"}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center mt-8 text-xs font-bold text-gray-400">
            {isLogin ? "New to the platform?" : "Part of the team?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-500 hover:underline underline-offset-4"
            >
              {isLogin ? "Create Profile" : "Secure Sign In"}
            </button>
          </p>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Third Party</span>
            <div className="h-px flex-1 bg-gray-100 dark:bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOAuthLogin(googleProvider)}
              className="flex items-center justify-center gap-3 py-3.5 rounded-[1.25rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-lg transition-all"
            >
              <FaGoogle className="text-rose-500" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOAuthLogin(githubProvider)}
              className="flex items-center justify-center gap-3 py-3.5 rounded-[1.25rem] bg-gray-900 border border-transparent shadow-lg text-white"
            >
              <Github size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500/50">
        Encrypted Endpoint v2.0
      </p>
    </div>
  );
}
