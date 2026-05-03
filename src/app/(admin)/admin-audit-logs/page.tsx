"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Eye,
  ListFilter, ChevronsUpDown, ChevronsDownUp, ArrowDownWideNarrow, Ellipsis,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HeaderUpdater from "@/components/ui/headerupdat";
import { useSession } from "next-auth/react";
import useGetAuditLogs from "@/hooks/use-get-audit-logs";
import useGetAllUser from "@/hooks/use-get-all-user";
import Link from "next/link";
import DeleteAllAdmin from "../components/deletet-all-admin";
import DeleteAdmin from "../components/deletet-admin";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "text-emerald-500",
  UPDATE: "text-orange-400",
  DELETE: "text-red-500",
  SET_IMMUTABLE: "text-purple-500",
  SEED_DATA: "text-blue-400",
};

const ROLE_COLORS: Record<string, string> = {
  "Super Admin": "text-red-500",
  SUPER_ADMIN: "text-red-500",
  ADMIN: "text-blue-500",
  Admin: "text-blue-500",
  USER: "text-gray-500",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    date: date.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }),
  };
}

const SORT_OPTIONS = [
  { label: "Action (descending)", value: "action:desc" },
  { label: "Action (ascending)", value: "action:asc" },
  { label: "User (descending)", value: "user:desc" },
  { label: "User (ascending)", value: "user:asc" },
  { label: "Entity (descending)", value: "entity:desc" },
  { label: "Entity (ascending)", value: "entity:asc" },
  { label: "Newest (descending)", value: "createdAt:desc" },
  { label: "Newest (ascending)", value: "createdAt:asc" },
];

const LIMIT = 20;

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingCategory, setPendingCategory] = useState("");
  const [pendingAction, setPendingAction] = useState("");

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedUserSearch, setAppliedUserSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedAction, setAppliedAction] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data: session } = useSession();
  const token = session?.token;

  // ── جيب الـ 20 user الأوائل بدون search (للـ usersMap الأساسي) ──
  const { data: usersData } = useGetAllUser({
    token,
    page: 1,
    limit: 20,
  });

  // ── جيب الـ users المبحوث عنهم ──
  const { data: searchedUsersData } = useGetAllUser({
    token,
    page: 1,
    limit: 10,
    search: appliedUserSearch || undefined,
  });

  // ── استخرج الـ userId لو البحث رجع نتيجة واحدة ──
  const searchedUserId = useMemo(() => {
    if (!appliedUserSearch) return undefined;
    const users: any[] = searchedUsersData?.payload?.data || [];
    return users.length > 0 ? users[0].id : undefined;
  }, [searchedUsersData, appliedUserSearch]);

  // ── audit logs مع actorUserId لو موجود ──
  const { data, isLoading } = useGetAuditLogs({
    token,
    page,
    limit: LIMIT,
    search: !appliedUserSearch ? (appliedSearch || undefined) : undefined,
    actorUserId: searchedUserId || undefined,
    category: appliedCategory || undefined,
    action: appliedAction || undefined,
    sortBy,
    sortOrder,
  });

  // ── usersMap يجمع الأساسيين + المبحوث عنهم ──
  const usersMap = useMemo(() => {
    const allUsers: any[] = usersData?.payload?.data || [];
    const searchedUsers: any[] = searchedUsersData?.payload?.data || [];
    const combined = [...allUsers, ...searchedUsers];
    return combined.reduce((acc: Record<string, any>, user: any) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }, [usersData, searchedUsersData]);

  const logs = data?.payload?.data || [];
  const total = data?.payload?.metadata?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);
  const from = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, total);

  const applyFilters = () => {
    const value = pendingSearch.trim();
    setAppliedSearch(value || "");
    setAppliedUserSearch(value || "");
    setAppliedCategory(pendingCategory);
    setAppliedAction(pendingAction);
    setPage(1);
  };

  const clearFilters = () => {
    setPendingSearch("");
    setPendingCategory("");
    setPendingAction("");
    setAppliedSearch("");
    setAppliedUserSearch("");
    setAppliedCategory("");
    setAppliedAction("");
    setPage(1);
  };

  return (
    <>
      <HeaderUpdater title="Audit Log" />
      <div className="min-h-screen bg-white font-mono p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{from} - {to} of {total}</span>
            <div className="flex items-center bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 hover:bg-gray-200 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div className="px-4 py-1 text-sm bg-white border-x border-gray-200 text-gray-600">
                Page {page} of {totalPages || 1}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 hover:bg-gray-200 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <DeleteAllAdmin />
        </div>

        {/* Search & Filters */}
        <div className="border border-gray-200 rounded-md mb-6 overflow-hidden shadow-sm">
          <div
            className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white cursor-pointer"
            onClick={() => setShowFilters(v => !v)}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ListFilter className="w-4 h-4" /> Search & Filters
            </div>
            <div className="text-xs">
              <Button variant="null" size="sm" className="text-white text-sm gap-1">
                <ChevronsDownUp className="w-4 h-4" />
                {showFilters ? "Hide" : "Show"}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="p-5 bg-white space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center">

                {/* Category */}
                <Select value={pendingCategory} onValueChange={setPendingCategory}>
                  <SelectTrigger className="h-10 w-full border-gray-200 text-gray-400 bg-white">
                    <SelectValue placeholder={<span className="text-gray-400 font-mono">Category</span>} />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4} className="z-50">
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="DIPLOMA">DIPLOMA</SelectItem>
                    <SelectItem value="EXAM">EXAM</SelectItem>
                    <SelectItem value="QUESTION">QUESTION</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="SYSTEM">SYSTEM</SelectItem>
                  </SelectContent>
                </Select>

                {/* Action */}
                <Select value={pendingAction} onValueChange={setPendingAction}>
                  <SelectTrigger className="h-10 w-full border-gray-200 text-gray-400 bg-white">
                    <SelectValue placeholder={<span className="text-gray-400 font-mono">Action</span>} />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4} className="z-50">
                    <SelectItem value=" ">All Actions</SelectItem>
                    <SelectItem value="CREATE">CREATE</SelectItem>
                    <SelectItem value="UPDATE">UPDATE</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="SET_IMMUTABLE">SET_IMMUTABLE</SelectItem>
                    <SelectItem value="SEED_DATA">SEED_DATA</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search */}
                <div className="relative">
                  <Input
                    placeholder="User"
                    className="h-10 border-gray-200 text-gray-400 placeholder:text-gray-400 focus-visible:ring-blue-500 bg-white pr-10"
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") applyFilters(); }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronsUpDown className="h-4 w-4 text-gray-400 opacity-50" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-black hover:bg-gray-200"
                >
                  Clear
                </Button>
                <Button
                  onClick={applyFilters}
                  className="bg-gray-200 font-mono hover:bg-gray-300 text-black px-6"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-blue-600 text-white uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Entity</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center gap-1 hover:text-gray-200 outline-none">
                      Sort <ArrowDownWideNarrow className="w-3 h-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 font-mono text-[11px]">
                      {SORT_OPTIONS.map(opt => (
                        <DropdownMenuItem
                          key={opt.value}
                          onClick={() => {
                            const [f, o] = opt.value.split(":");
                            setSortBy(f);
                            setSortOrder(o);
                            setPage(1);
                          }}
                          className={`flex items-center gap-2 py-2 cursor-pointer
                            ${sortBy + ":" + sortOrder === opt.value ? "text-blue-600 font-bold" : ""}`}
                        >
                          {opt.value.includes("desc") ? "↓" : "↑"} {opt.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">Loading...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">No logs found</td>
                </tr>
              ) : logs.map((log: any) => {
                const { time, date } = formatDate(log.createdAt);
                const user = usersMap[log.actorUserId];
                const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : log.actorUsername;
                const displayEmail = user?.email || log.actorEmail;
                const displayRole = user?.role || log.actorRole;
                const displayAvatar = user?.profilePhoto || null;

                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">

                    <td className="px-4 py-4">
                      <div className={`font-bold ${ACTION_COLORS[log.action] || "text-gray-600"}`}>
                        {log.action}
                      </div>
                      <div className="text-gray-400 text-[10px] mt-0.5">
                        Method: {log.httpMethod}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {displayAvatar && (
                          <img
                            src={displayAvatar}
                            alt={displayName}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="text-gray-900 font-medium">{displayName}</div>
                          <div className="text-gray-400 text-[10px]">{displayEmail}</div>
                          <div className={`text-[10px] font-bold mt-0.5 ${ROLE_COLORS[displayRole] || "text-gray-500"}`}>
                            {displayRole}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-gray-800">{log.entityType}</div>
                      <div className="text-blue-400 text-[10px] flex items-center gap-1 mt-0.5">
                        <span className="truncate max-w-[150px]">{log.entityId}</span>
                        <Eye className="w-2.5 h-2.5 flex-shrink-0" />
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-gray-700">{time}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{date}</div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 hover:bg-gray-100 rounded-md outline-none">
                          <div className="bg-gray-100 p-1 rounded">
                            <Ellipsis className="w-4 h-4 text-gray-400" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs font-mono">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin-audit-logs/${log.id}`}
                              className="gap-2 text-emerald-600 cursor-pointer flex items-center px-2 py-1.5 text-xs"
                            >
                              <Eye className="w-3 h-3" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-500 cursor-pointer">
                            <DeleteAdmin logId={log.id} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {logs.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
              <span>{from} - {to} of {total}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}