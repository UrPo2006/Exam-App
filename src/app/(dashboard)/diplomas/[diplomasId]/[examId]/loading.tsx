import { Skeleton } from "@/components/ui/skeleton";

  // Skeleton for loading state
 export default function ExamCardSkeleton() {
    return (
      <div className="grid grid-cols-1 gap-8 p-6 bg-white mt-5">
        {/* Progress Bar Skeleton */}
        <div className="flex justify-around">
          <div className="w-260">
            <div className="flex justify-between mb-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="w-260 h-4" />
          </div>
          <Skeleton className="w-12 h-12 rounded-full ml-4" />
        </div>

        {/* Question Card Skeleton */}
        <div className="w-290 border rounded-lg p-6 flex flex-col gap-6">
          {/* Question Text */}
          <Skeleton className="h-6 w-3/4" />

          {/* Answers */}
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-around gap-4">
            <Skeleton className="h-11 w-138" />
            <Skeleton className="h-11 w-138" />
          </div>
        </div>
      </div>
    );
  }