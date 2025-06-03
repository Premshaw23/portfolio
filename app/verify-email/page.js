"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, sendEmailVerification } from "@/lib/firebase"; // adjust if needed
import {deleteUser ,onAuthStateChanged} from "firebase/auth";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        toast.error("No user is signed in.");
        router.push("/login");
        return;
      }

      setUser(currentUser);

      if (currentUser.emailVerified) {
        router.push("/dashboard");
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [router]);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!user) {
      toast.error("No user is signed in.");
      return;
    }

    try {
      setResending(true);
      await sendEmailVerification(user);
      toast.success("Verification email sent again!");
      setCooldown(30); // 30 seconds cooldown
    } catch (err) {
      // console.error("Resend error:", err);
      if (err.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please wait before trying again.");
      } else {
        toast.error("Failed to resend verification email.");
      }
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) {
      // toast.error("No user is signed in.");
      return;
    }

    try {
      setChecking(true);
      await user.reload();
      const updatedUser = auth.currentUser;
      setUser(updatedUser);

      if (updatedUser.emailVerified) {
        toast.success("Email verified! Redirecting...");
        router.push("/dashboard");
      } else {
        toast.warning("Email is still not verified.");
      }
    } catch (err) {
      // console.error("Check verification error:", err);
      toast.error("Error checking email verification.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    if (!user) {
      toast.error("No user logged in.");
      return;
    }

    try {
      await deleteUser(user);
      toast.success("User deleted and logged out.");
      router.push("/login");
    } catch (error) {
      // console.error("Error deleting user:", error);

      if (error.code === "auth/requires-recent-login") {
        toast.error("Please log in again to delete your account.");
        // Optionally, redirect to login page or show re-authentication flow here
        router.push("/login");
      } else {
        toast.error("Failed to delete user.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="mb-6 text-gray-600">
          A verification link has been sent to your email. Please verify your
          account to continue.
        </p>

        <button
          onClick={handleCheckVerification}
          disabled={checking || !user}
          className="w-full py-2 mb-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {checking ? "Checking..." : "I’ve Verified My Email"}
        </button>

        <button
          onClick={handleResend}
          disabled={resending || !user || cooldown > 0}
          className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {resending
            ? "Resending..."
            : cooldown > 0
            ? `Wait ${cooldown}s`
            : "Resend Verification Email"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-2 mt-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Logout
        </button>

        <p className="text-sm text-gray-400 mt-4">
          Didn’t get the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
