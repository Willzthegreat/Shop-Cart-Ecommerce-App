import React from "react";
import Link from "next/link";
import Logo from "@/components/logo";




const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo />

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Looking for something?
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            We&apos;re sorry. The Web address you entered is not valid.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-4 py-2
            border border-transparent text-sm font-medium rounded-md
            text-white bg-green-600 hover:bg-green-700
            focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-green-600"
          >
            Go to Shopcart&apos;s Home Page
          </Link>

          <Link
            href="/help"
            className="w-full inline-flex items-center justify-center px-4 py-2
            border border-transparent text-sm font-medium rounded-md
            text-white bg-green-600 hover:bg-green-700
            focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-green-600"
          >
            Help
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Visit the{" "}
            <Link
              href="/help"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Help section
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="font-medium text-green-600 hover:text-green-500"
            >
              contact us
            </Link>{" "}
            for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;