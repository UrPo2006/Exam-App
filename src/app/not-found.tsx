import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="text-center max-w-md">

        <h1 className="text-[120px] font-medium leading-none tracking-[-4px] text-gray-200 mb-2">
          4<span>🥲</span>4
        </h1>

        <div className="w-12 h-[2px] bg-gray-300 mx-auto mb-6" />

        <p className="text-xl font-medium text-gray-800 mb-3">
          Page not found
        </p>

        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back to home
        </Link>

      </div>
    </div>
  );
}