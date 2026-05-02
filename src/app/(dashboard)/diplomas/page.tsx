"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Daum, Root } from "@/interfaces";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

// Skeleton Card Component
function DiplomaCardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6 max-w-7xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-112  overflow-hidden shadow-2xl relative animate-pulse bg-gray-200"
          >
            {/* Image placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />

            {/* Bottom panel placeholder */}
            <div className="absolute bottom-0 left-0 right-0 bg-blue-200/80 p-6 h-[70px]"></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function DiplomasGrid() {
  const [diplomas, setDiplomas] = useState<Daum[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  // Fetch diplomas on component mount
  useEffect(() => {
    const fetchDiplomas = async () => {
      try {
        const response = await fetch("/api/diplomas");
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const res: Root = await response.json();

        if (res.status && res.payload?.data) {
          setDiplomas(res.payload.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiplomas();
  }, []);

  // Handle "Show More" button click
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
    setTimeout(() => {
      window.scrollBy({ top: 300, behavior: "smooth" });
    }, 100);
    if (visibleCount + 6 >= diplomas.length) {
      <DiplomaCardSkeleton />;
    }
  };

  if (loading) return <DiplomaCardSkeleton />;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6 max-w-7xl">
        {diplomas.slice(0, visibleCount).map((diploma) => (
          <div key={diploma.id}>
            <Link href={`/diplomas/${diploma.id}`}>
              <Card className="group relative overflow-hidden cursor-pointer h-112 border-none shadow-2xl">
                <Image
                  src={diploma.image}
                  alt={diploma.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div
                    className="bg-blue-600/95 p-6 text-white text-left shadow-xl
                                  transform translate-y-[calc(100%-70px)] group-hover:translate-y-0
                                  transition-transform duration-500 ease-in-out
                                  max-h-[85%] flex flex-col items-center"
                  >
                    <h3 className="font-bold text-xl mb-3 tracking-wide pb-5 w-full">
                      {diploma.title}
                    </h3>
                    <p className="text-sm md:text-base opacity-95 leading-relaxed overflow-y-auto">
                      {diploma.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {visibleCount < diplomas.length && (
        <div
          className="w-full flex flex-col items-center justify-center py-12 space-y-2 text-gray-400 hover:text-blue-600 transition-all cursor-pointer group"
          onClick={handleShowMore}
        >
          <span className="text-sm font-semibold uppercase tracking-widest group-hover:scale-105 transition-transform">
            Scroll to view more
          </span>
          <ChevronDown size={18} />
        </div>
      )}

      {visibleCount >= diplomas.length && diplomas.length > 0 && (
        <div className="py-10 text-gray-400 text-sm italic">
          No more diplomas to show.
        </div>
      )}
    </>
  );
}
