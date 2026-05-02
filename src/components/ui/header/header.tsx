"use client";

import {
  BookOpenCheck,
  ChevronLeft,
  GraduationCap,
  HelpCircle,
  UserRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useHeader } from "../context/HeaderContext";
import { useSession } from "next-auth/react";
import AdminHeader from "@/app/(admin)/components/Admin Header/admin-header";

const navItems = [
  { href: "/", label: "Diplomas", icon: GraduationCap },
  { href: "/account", label: "Account Settings", icon: UserRound },
];

export default function DynamicHeader() {
  const { headerTitle } = useHeader();
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();
  const role = session?.user?.role;

  const { title, diplomaName, examName } = headerTitle;
  const segments = pathname.split("/").filter(Boolean);

  // Active nav
  const activeNav =
    navItems.find(
      ({ href }) => pathname === href || pathname.startsWith(href + "/")
    ) ?? navItems[0];

  // Icon
  let Icon = activeNav.icon;
  if (pathname.includes("/results")) {
    Icon = HelpCircle;
  } else if (segments.length >= 3 && segments[0] === "diplomas") {
    Icon = HelpCircle;
  } else if (segments.length === 2 && segments[0] === "diplomas") {
    Icon = BookOpenCheck;
  }

  // Header Title
  let headerLabel = activeNav.label;
  if (segments.length >= 2 && segments[0] === "diplomas") {
    headerLabel = examName || title || diplomaName || "Exam";
  } else if (pathname.includes("/results")) {
    headerLabel = examName || title || "Results";
  }

  // Breadcrumb
  const renderBreadcrumb = () => {
    if (pathname === "/account/account-password") {
      return (
        <>
          <span>Account</span>
          <span>/</span>
          <span className="text-blue-600">Change Password</span>
        </>
      );
    }

    if (pathname === "/account") {
      return <span>Account</span>;
    }

    if (segments.length === 2 && segments[0] === "diplomas") {
      return (
        <>
          <span>Diplomas</span>
          <span>/</span>
          <span className="text-gray-400">{diplomaName || title}</span>
          <span>/</span>
          <span className="text-blue-600">Exam</span>
        </>
      );
    }

    if (segments.length >= 3 && segments[0] === "diplomas") {
      return (
        <>
          <span>Diplomas</span>
          <span>/</span>
          <span className="text-gray-400">{diplomaName}</span>
          <span>/</span>
          <span className="text-blue-600">{examName || title}</span>
        </>
      );
    }

    if (pathname.includes("/results")) {
      return (
        <>
          <span>Diplomas</span>
          <span>/</span>
          <span className="text-gray-400">{diplomaName || title}</span>
          <span>/</span>
          <span className="text-blue-600">{examName || title}</span>
        </>
      );
    }

    return <span>{activeNav.label}</span>;
  };

  const showBack =
    pathname.includes("/diplomas") ||
    pathname.includes("/quiz") ||
    pathname.includes("/results") ||
    pathname.includes("/account");

  
  if (role === "ADMIN") {
    return <AdminHeader title={headerLabel} />;
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4 mt-3 font-mono">
        {renderBreadcrumb()}
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-12 h-20 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div className="flex-1 flex items-center gap-4 bg-blue-600 text-white p-5 shadow-lg">
          <Icon size={40} />
          <h2 className="text-2xl font-bold tracking-wide font-inter">
            {headerLabel}
          </h2>
        </div>
      </div>
    </>
  );
}