"use client";

import { use} from "react";
import {  ExternalLink } from "lucide-react";

import HeaderUpdater from "@/components/ui/headerupdat";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import useGetAuditLogById from "@/hooks/use-get-audit-log-by-id";
import DeleteAdmin from "../../components/deletet-admin";



const ACTION_COLORS: Record<string, string> = {
  CREATE: "text-emerald-500",
  UPDATE: "text-orange-400",
  DELETE: "text-red-500",
  SET_IMMUTABLE: "text-purple-500",
  SEED_DATA: "text-blue-400",
};

const ROLE_COLORS: Record<string, string> = {
  "Super Admin": "text-red-500",
  ADMIN: "text-blue-500",
  Admin: "text-blue-500",
};

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return {
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }),
    date: date.toLocaleDateString("en-US", {
      weekday: "short", month: "long", day: "numeric", year: "numeric",
    }),
  };
}

export default function AuditLogDetailPage() {

const params = useParams();
const id = params.id as string;
  
  // console.log("ID ", id);
  const router = useRouter();

  const { data: session } = useSession();
  const token = session?.token;

  const { data, isLoading } = useGetAuditLogById(token, id);
const log = data?.payload?.auditLog;

// console.log("DATA", data);
// console.log("LOG", log)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (!log) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-gray-400 text-sm">
        Log not found.
      </div>
    );
  }

  const { time, date } = formatDateTime(log.createdAt);


  const pageTitle = `${log.entityType} ${log.action} By ${log.actorUsername}`;


  const updatedFields = log.metadata
    ? Object.keys(log.metadata).filter(k => k !== "id").join(", ")
    : null;

  const metadataJson = log.metadata
    ? JSON.stringify(log.metadata, null, 2)
      .replace(/^\{/, "")
      .replace(/\}$/, "")
      .trim()
    : null;

  return (
    <>
      <HeaderUpdater title={pageTitle} />
      <div className="min-h-screen bg-gray-50 font-mono p-6">

        {/* Breadcrumb */}
      

 
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-800 mb-1">{pageTitle}</h1>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>Entity:</span>
              <span className="text-gray-400  flex items-center gap-0.5">
                {log.entityType}: {log.entityId}
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>



          <div className="bg-red-500 hover:bg-red-600 text-white text-xs h-9 px-4   shadow-none">
            <DeleteAdmin logId={log.id} />
          </div>
        </div>

        {/* Detail Card */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 space-y-6 max-w-3xl">

          {/* Action */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Action</p>
            <p className={`text-sm font-bold ${ACTION_COLORS[log.action] || "text-gray-700"}`}>
              {log.action}
            </p>
          </div>

          {/* Method */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Method</p>
            <p className="text-sm text-gray-700">{log.httpMethod}</p>
          </div>

          {/* User */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">User</p>
            <p className="text-sm text-gray-800 font-medium">{log.actorUsername}</p>
            <p className="text-xs text-gray-500 mt-0.5">Email: {log.actorEmail}</p>
            <p className="text-xs text-gray-500">IP Address: {log.ipAddress}</p>
            <p className="text-xs mt-0.5">
              Role:{" "}
              <span className={`font-bold ${ROLE_COLORS[log.actorRole] || "text-gray-500"}`}>
                {log.actorRole}
              </span>
            </p>
          </div>

          {/* Entity */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Entity</p>
            <p className="text-sm text-blue-500 flex items-center gap-1">
              {log.entityType}: {log.entityId}
              <ExternalLink className="w-3 h-3" />
            </p>
          </div>

          {/* Date & Time */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
            <p className="text-sm text-gray-700">
              {time} | {date}
            </p>
          </div>

 
          {updatedFields && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Updated Fields</p>
              <p className="text-sm text-gray-700">{updatedFields}</p>
            </div>
          )}

          {/* Metadata */}
          {metadataJson && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Metadata</p>
              <pre className="bg-gray-100 rounded-sm p-4 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {metadataJson}
              </pre>
            </div>
          )}

        </div>
      </div>
    </>
  );
}