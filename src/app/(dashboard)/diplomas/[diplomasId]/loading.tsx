
export default function ExamsLoading() {
  return (
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-1 gap-8 p-6 bg-white mt-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative h-34 flex">
            <div className="w-250 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-6">
                {/* Image Skeleton */}
                <div className="w-24 h-24 bg-blue-100 animate-pulse rounded" />

                {/* Content Skeleton */}
                <div className="flex-1 flex flex-col gap-3">
                  {/* Title + meta row */}
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-48 bg-blue-100 animate-pulse rounded" />
                    <div className="h-4 w-36 bg-gray-100 animate-pulse rounded" />
                  </div>

                  {/* Description */}
                  <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}