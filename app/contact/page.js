"use client";
import { toast, Bounce } from "react-toastify";
import { useState } from "react";
import emailjs from "emailjs-com";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Define the parameters to be sent to the EmailJS template
    const templateParams = {
      name,
      email,
      message,
    };

    setIsLoading(true);
    // Send the email using EmailJS
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, // Replace with your EmailJS service ID
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, // Replace with your EmailJS template ID
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          setSuccessMessage("Your message has been sent successfully!");
          setErrorMessage(""); // Clear previous errors
          setIsLoading(false);

          toast.success("Your message has been sent successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });

          setName("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          setErrorMessage("Oops! Something went wrong. Please try again.");
          setSuccessMessage(""); // Clear previous success messages
          setIsLoading(false);

          toast.error("Oops! Something went wrong. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        }
      );
  };

  return (
    <div className="max-w-[33rem] md:mx-auto mx-4 mt-24 mb-11 p-8 bg-gray-900 rounded-2xl shadow-xl shadow-purple-700">
      <h1 className="text-4xl font-extrabold text-center text-purple-400 mb-4">
        Get In Touch
      </h1>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-purple-300"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="w-full px-4 py-3 bg-gray-800 border border-purple-700 rounded-lg shadow-sm text-purple-100 placeholder-purple-500
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-purple-300"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 bg-gray-800 border border-purple-700 rounded-lg shadow-sm text-purple-100 placeholder-purple-500
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Message Input */}
        <div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-purple-300"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            placeholder="Write your message here..."
            required
            className="w-full px-4 py-3 bg-gray-800 border border-purple-700 rounded-lg shadow-sm text-purple-100 placeholder-purple-500 resize-none
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 mt-2 rounded-lg text-white font-semibold text-lg transition shadow-lg shadow-purple-700/60 
    ${
      isLoading
        ? "bg-purple-400 cursor-not-allowed"
        : "bg-purple-600 hover:bg-purple-700"
    }`}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
