import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-green-300 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-400 mb-6">
        Sorry, we couldn’t find that page.
      </p>
      <Link href="/" className="text-pink-800 underline hover:text-pink-300">
        Go back home
      </Link>
    </div>
  );
}
