"use client";

import { toast, Bounce } from "react-toastify";
import { useState } from "react";
import emailjs from "emailjs-com";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Mail, Send, User, MessageSquare, Sparkles } from "lucide-react";

const ContactUs = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [queryType, setQueryType] = useState("General Enquiry");
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consent) {
      toast.warn("Please give consent to be contacted.", {
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const templateParams = {
      name: `${firstName} ${lastName}`,
      email,
      message,
      queryType,
    };

    setIsLoading(true);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      )
      .then(
        () => {
          toast.success("Your message has been sent successfully!", {
            theme: "dark",
            transition: Bounce,
          });
          setFirstName("");
          setLastName("");
          setEmail("");
          setMessage("");
          setConsent(false);
          setQueryType("General Enquiry");
        },
        () => {
          toast.error("Oops! Something went wrong. Please try again.", {
            theme: "dark",
            transition: Bounce,
          });
        }
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 py-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm mb-6">
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                Get In Touch
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have a question or want to work together? Drop me a message!
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20" />

            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                      className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="relative">
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                      className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Query Type */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Sparkles className="w-4 h-4" />
                    Query Type
                  </label>
                  <div className="flex gap-6">
                    {["General Enquiry", "Support Request"].map((type) => (
                      <label
                        key={type}
                        className="inline-flex items-center cursor-pointer group"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            value={type}
                            checked={queryType === type}
                            onChange={() => setQueryType(type)}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              queryType === type
                                ? "border-purple-600 bg-purple-600"
                                : "border-gray-300 dark:border-gray-600 group-hover:border-purple-400"
                            }`}
                          >
                            {queryType === type && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    required
                    className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={() => setConsent(!consent)}
                      className="sr-only"
                      id="consent"
                    />
                    <label
                      htmlFor="consent"
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                        consent
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      {consent && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </label>
                  </div>
                  <label
                    htmlFor="consent"
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    I hereby consent to being contacted by the team
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-[1.02]"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
