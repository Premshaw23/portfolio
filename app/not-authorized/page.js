// app/not-authorized/page.js

import Link from "next/link";

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center bg-white rounded-lg shadow-lg p-8 border border-red-200">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">
          🚫 Access Denied
        </h1>
        <p className="text-lg text-red-700 mb-6">
          You do not have permission to view this page.
        </p>
        <Link href="/">
          <button
            className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            aria-label="Back to Home"
          >
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
