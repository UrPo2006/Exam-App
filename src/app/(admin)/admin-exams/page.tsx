"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft, ChevronRight, Plus, Search,
  SlidersHorizontal, MoreVertical, Eye, Pencil,
  Trash2, ChevronsDownUp, ArrowDownWideNarrow,
} from "lucide-react";
import useGetExams from "@/hooks/use-get-exams";
import useGetDiplomasList from "@/hooks/use-get-diplomas-list";

import DeleteExam from "../components/delete-exam/delete";


const SORT_OPTIONS = [
  { label: "Title (descending)", field: "title", order: "desc" as const },
  { label: "Title (ascending)", field: "title", order: "asc" as const },
  { label: "Questions No. (descending)", field: "questions", order: "desc" as const }, 
  { label: "Questions No. (ascending)", field: "questions", order: "asc" as const },   
  { label: "Newest (descending)", field: "createdAt", order: "desc" as const },
  { label: "Newest (ascending)", field: "createdAt", order: "asc" as const },
]
export default function ExamsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [diplomaId, setDiplomaId] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0].label);
const [immutable, setImmutable] = useState("");




  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

// useGetExams 
const { data, isLoading, isFetching } = useGetExams({
  page, search, sortBy, sortOrder, diplomaId,
  immutable, 
});

  const { data: diplomasList = [] } = useGetDiplomasList();

  const exams = data?.payload?.data || [];
  const metadata = data?.payload?.metadata || {
    page: 1, limit: 20, total: 0, totalPages: 1,
  };

  const loading = isLoading || isFetching;
  const startItem = (metadata.page - 1) * metadata.limit + 1;
  const endItem = Math.min(metadata.page * metadata.limit, metadata.total);

  const handleSort = (opt: typeof SORT_OPTIONS[0]) => {
    setSortBy(opt.field);
    setSortOrder(opt.order);
    setActiveSort(opt.label);
    setSortOpen(false);
    setPage(1);
  };

const handleClear = () => {
  setSearchInput("");
  setSearch("");
  setDiplomaId("");
  setImmutable(""); 
  setPage(1);
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-4">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-medium text-gray-800 text-lg">
              {startItem} – {endItem} of {metadata.total}
            </span>

            <div className="flex items-center gap-1 bg-gray-200 h-10">
              <Button
                variant="outline" size="icon"
                disabled={metadata.page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft />
              </Button>
              <span className="px-2">
                Page {metadata.page} of {metadata.totalPages}
              </span>
              <Button
                variant="outline" size="icon"
                disabled={metadata.page >= metadata.totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

          <Link href="/add-exam">
           <Button className="bg-emerald-500 h-10 w-49 hover:bg-emerald-600 text-white gap-2">
              <Plus className="w-4 h-4" />
              Create New Exam
            </Button>
          </Link>
          
        </div>

        {/* FILTERS */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <div className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-600">
              <div className="flex items-center gap-2 text-lg text-white">
                <SlidersHorizontal className="w-5 h-5" />
                Search &amp; Filters
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="null" size="sm" className="text-white text-sm gap-1">
                  <ChevronsDownUp className="w-4 h-4" />
                  Hide
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="px-4 py-4 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Input
                    placeholder="Search by title"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setSearch(searchInput)}
                    className="h-11"
                  />
                  <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                </div>

                <div className="flex gap-3">
                  {/* Diploma Filter */}
                  <Select value={diplomaId} onValueChange={setDiplomaId}>
                    <SelectTrigger className="h-11 w-48">
                      <SelectValue placeholder="Diploma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Diplomas</SelectItem>
                      {diplomasList.map((d: any) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Immutability Filter */}
           
<Select value={immutable} onValueChange={(val) => { setImmutable(val); setPage(1); }}>
  <SelectTrigger className="h-11 w-48">
    <SelectValue placeholder="Immutability" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="true">Immutable</SelectItem> 
    <SelectItem value="false">Mutable</SelectItem>
  </SelectContent>
</Select>

                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline" size="sm"
                    onClick={handleClear}
                    className="w-25 h-9 font-mono rounded-none border-none"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gray-200 hover:bg-gray-300 text-black w-25 h-9 font-mono rounded-none"
                    onClick={() => { setSearch(searchInput); setPage(1); }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-600 hover:bg-blue-600 h-9 font-mono">
                <TableHead className="text-white font-semibold w-20">Image</TableHead>
                <TableHead className="text-white font-semibold">Title</TableHead>
                <TableHead className="text-white font-semibold">Diploma</TableHead>
                <TableHead className="text-white font-semibold">No. of Questions</TableHead>
                <TableHead className="text-white font-semibold text-right">
                  <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost" size="sm"
                        className="text-white hover:bg-blue-700 hover:text-white gap-1"
                      >
                        Sort
                        <ArrowDownWideNarrow className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {SORT_OPTIONS.map((opt) => (
                        <DropdownMenuItem
                          key={opt.label}
                          onClick={() => handleSort(opt)}
                          className={activeSort === opt.label ? "bg-blue-50 text-blue-700 font-medium" : ""}
                        >
                          {opt.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(5)].map((__, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    No exams found 🥲
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam: any, idx: number) => (
                  <TableRow
                    key={exam.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    {/* Image */}
                    <TableCell>
                      <div className="w-12 h-12 overflow-hidden rounded">
                        {exam.image ? (
                          <Image
                            src={exam.image}
                            alt={exam.title}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell className="font-mono font-medium text-gray-800">
                      {exam.title}
                    </TableCell>

                    {/* Diploma */}
                    <TableCell className="font-mono text-gray-500">
                      {exam.diploma?.title || "—"}
                    </TableCell>

                    {/* Questions Count */}
                    <TableCell className="font-mono text-gray-600">
                      {exam.questionsCount ?? exam.questions?.length ?? "—"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <Link href={`/admin-exams/${exam.id}`}>
                            <DropdownMenuItem className="gap-2 text-gray-700">
                              <Eye className="w-4 h-4 text-blue-500" />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/admin-exams/${exam.id}/edit-exam`}>
                            <DropdownMenuItem className="gap-2 text-gray-700">
                            <Pencil className="w-4 h-4 text-green-500" />
                            Edit
                          </DropdownMenuItem>
                          </Link>
                        
                                                <DropdownMenuItem  >
<DeleteExam examId={exam.id} variant="ghost" 
    className=" gap-2 text-red-600 focus:text-red-600"
  />
  </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}