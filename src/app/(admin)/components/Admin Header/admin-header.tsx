"use client";

import { useHeader } from "@/components/ui/context/HeaderContext";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const { headerTitle } = useHeader();
  const { title, diplomaName, examName } = headerTitle;
  const pathname = usePathname();

  // PATH
  const isAuditLogPage = pathname.includes("admin-audit-logs");
  const isExamPage = pathname.includes("exam") || pathname.includes("add-qu");


  let mainCategory = "Diplomas";
  if (isAuditLogPage) {
    mainCategory = "Audit Log";
  } else if (isExamPage) {
    mainCategory = "Exams";
  }

  const isRoot = 
    pathname === "/admin" || 
    pathname === "/admin-diploma" || 
    pathname === "/admin-exams" || 
    pathname === "/admin-audit-logs"; 

  return (
    <nav className="flex items-center gap-2 text-sm font-mono mt-3">
      {/*  Diplomas / Exams / Audit Log */}
      <span className="text-gray-400 capitalize">
        {mainCategory}
      </span>

      {/*examName */}
      {!isRoot && examName && (
        <>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400 font-medium">
            {examName}
          </span>
        </>
      )}
      
      {/*  diplomaName*/}
      {!isRoot && diplomaName && (
        <>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">
            {diplomaName}
          </span>
        </>
      )}

      {/* title */}
      {!isRoot && title && (
        <>
          <span className="text-gray-400">/</span>
          <span className="text-blue-600 font-medium">
            {title}
          </span>
        </>
      )}
    </nav>
  );
}