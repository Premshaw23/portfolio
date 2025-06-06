"use client";

import { toast, Bounce } from "react-toastify";
import { useState } from "react";
import emailjs from "emailjs-com";
import Footer from "@/components/footer";

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
      <div className="max-w-2xl md:mx-auto mx-2 mt-24 mb-8 px-6 py-10 rounded-2xl shadow-2xl bg-gray-300 dark:bg-gray-900 shadow-gray-900/70 dark:shadow-purple-800/30">
        <h1 className="text-4xl font-bold text-center text-purple-700 dark:text-purple-400 mb-10">
          Contact Us
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-gray-800 dark:text-purple-100"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm text-gray-600 dark:text-purple-300">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-purple-700 rounded-lg placeholder-gray-400 dark:placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm text-gray-600 dark:text-purple-300">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-purple-700 rounded-lg placeholder-gray-400 dark:placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-purple-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-purple-700 rounded-lg placeholder-gray-400 dark:placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block mb-3 text-sm text-gray-600 dark:text-purple-300">
              Query Type
            </label>
            <div className="flex gap-6">
              {["General Enquiry", "Support Request"].map((type) => (
                <label
                  key={type}
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    value={type}
                    checked={queryType === type}
                    onChange={() => setQueryType(type)}
                    className="form-radio text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 dark:text-purple-300">
              Message
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              required
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-purple-700 rounded-lg placeholder-gray-400 dark:placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              checked={consent}
              onChange={() => setConsent(!consent)}
              className="mt-1 mr-3 accent-purple-600"
            />
            <label className="text-sm text-gray-600 dark:text-purple-300">
              I hereby consent to being contacted by the team
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-4 rounded-lg text-white font-semibold text-lg transition shadow-lg
            ${
              isLoading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isLoading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;