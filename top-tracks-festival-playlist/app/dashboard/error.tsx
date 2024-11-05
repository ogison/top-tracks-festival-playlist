"use client";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="border border-green-500 p-8 rounded">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="mb-6">
            <p className="text-2xl mb-2">
              Error : An unexpected error occurred
            </p>
            <p className="text-sm">
              An error occurred while processing your request.
            </p>
          </div>
          <div>
            <Link
              href="/"
              className="inline-block border border-green-500 px-4 py-2 text-sm hover:bg-green-500 hover:text-black transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
