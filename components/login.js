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
    <div className="bg-gray-200 p-6 my-7 mx-4 shadow-xl shadow-gray-500 rounded-2xl font-sans w-full max-w-lg">
      {/* Title */}
      <h1 className="text-center text-2xl font-bold mb-6 text-[#151717]">
        {isLogin ? "Login" : "Sign Up"}
      </h1>

      {/* Auth Form */}
      <form
        autoComplete="on"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {!isLogin && (
          <>
            <label htmlFor="name" className="text-[#151717] font-semibold">
              Full Name
            </label>
            <div className="flex items-center border border-[#ecedec] rounded-xl h-12 px-3 transition duration-200 focus-within:border-[#2d79f7]">
              <svg
                height={20}
                width={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                className="w-full h-full rounded-xl border-none focus:outline-none placeholder-gray-400 text-gray-900 ml-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          </>
        )}

        {/* Email */}
        <label htmlFor="email" className="text-[#151717] font-semibold">
          Email
        </label>
        <div className="flex items-center border border-[#ecedec] rounded-xl h-12 px-3 transition duration-200 focus-within:border-[#2d79f7]">
          <svg
            height={20}
            width={20}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-gray-500"
          >
            <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
          </svg>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            placeholder="Enter your Email"
            className="w-full h-full rounded-xl border-none focus:outline-none placeholder-gray-400 text-gray-900 ml-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <label htmlFor="password" className="text-[#151717] font-semibold">
          Password
        </label>
        <div className="flex items-center border border-[#ecedec] rounded-xl h-12 px-3 transition duration-200 focus-within:border-[#2d79f7] space-x-2">
          <svg
            height={20}
            width={20}
            viewBox="-64 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-gray-500"
          >
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            name="password"
            placeholder="Enter your Password"
            className="w-full h-full rounded-xl border-none focus:outline-none placeholder-gray-400 text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="focus:outline-none"
          >
            {showPassword ? (
              <FiEyeOff className="text-gray-500" size={20} />
            ) : (
              <FiEye className="text-gray-500" size={20} />
            )}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-gray-600 text-sm mt-1">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
            />
            <span>Remember me</span>
          </label>
          {isLogin ? (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Error Display */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`self-end rounded-xl px-6 py-2 font-semibold transition duration-200
        ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-[#2d79f7] hover:bg-blue-600 text-white"
        }`}
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {/* Toggle Auth Mode */}
      <p className="text-gray-600 text-center mt-4">
        {isLogin ? "Don&apos;t have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsLogin((prev) => !prev);
            setError(null); // Clear any previous errors when toggling modes
          }}
          className="text-blue-600 hover:underline"
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="mx-2 text-sm text-gray-500">OR</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleOAuthLogin(googleProvider)}
          className="flex items-center cursor-pointer justify-center gap-2 bg-white border border-gray-300 rounded-xl py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuthLogin(githubProvider)}
          className="flex items-center justify-center cursor-pointer gap-2 bg-black text-white rounded-xl py-2 hover:bg-gray-900 transition duration-200"
        >
          <FaGithub />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
