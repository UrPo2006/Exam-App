"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  ChevronsDownUp,
  ArrowDownWideNarrow,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  IDiplomaApiResponse,
  IDiplomaItem,
  IDiplomaMetadata,
} from "../types/DiplomasTable";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import useDeleteDiploma from "@/hooks/use-delete-diploma";
import { toast } from "sonner";
// ===============================
async function fetchDiplomasApi({
  page,
  search,
  sortField,
  sortOrder,
  immutability,
}: {
  page: number;
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  immutability: string;
}): Promise<IDiplomaApiResponse> {

  const params = new URLSearchParams({
    page: page.toString(),
    limit: "12",
    search: search.trim(),  
    sortBy: sortField,     
    sortOrder,
    immutability,
  });

  console.log("REQUEST:", `/api/admin?${params}`);

  const res = await fetch(`/api/admin?${params}`);
  if (!res.ok) throw new Error("Server error");

  const json = await res.json();
  console.log("API RESPONSE:", json);

  return json;
}
// ===============================
// SORT OPTIONS

const SORT_OPTIONS = [
  { label: "Title (descending)", field: "title", order: "desc" as const },
  { label: "Title (ascending)", field: "title", order: "asc" as const },
  { label: "Newest (descending)", field: "createdAt", order: "desc" as const },
  { label: "Newest (ascending)", field: "createdAt", order: "asc" as const },
];

// ===============================
// COMPONENT

export default function DiplomasTable({
  params,
}: {
  params: Promise<{ diplomasId: string }>;
}) {

 

  // ===============================
  // STATES
  const { mutate: deleteDiploma, isPending: isDeleting } = useDeleteDiploma();
  const [page, setPage] = useState(1);
  const [diplomas, setDiplomas] = useState<IDiplomaItem[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [immutability, setImmutability] = useState("");

  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0].label);

  // ===============================
  // DEBOUNCE SEARCH

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);
const filteredDiplomas = diplomas.filter((item) =>
  item.title.toLowerCase().includes(search.toLowerCase())
);
  // ===============================
  // REACT QUERY

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["diplomas", page, search, sortField, sortOrder, immutability],
    queryFn: () =>
      fetchDiplomasApi({
        page,
        search,
        sortField,
        sortOrder,
        immutability,
      }),
    placeholderData: (prev) => prev,
  });
  // console.log("API RESPONSE:", data);

  // ===============================
  // SYNC DATA WITH STATE

useEffect(() => {
  if (data?.payload?.data) {
    setDiplomas(data.payload.data);
  } else if (!isFetching) {
   
    setDiplomas([]);
  }
}, [data, isFetching]);

  // ===============================
  // METADATA

  const metadata: IDiplomaMetadata = data?.payload?.metadata || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  };

  // ===============================
  // ACTIONS

  const handleApply = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const handleSort = (opt: (typeof SORT_OPTIONS)[0]) => {
    setSortField(opt.field);
    setSortOrder(opt.order);
    setActiveSort(opt.label);
    setSortOpen(false);
    setPage(1);
  };

  // ===============================
  //handleDelete
   const handleDelete = (id: string) => {
  console.log("Deleting diploma with ID:", id);
    deleteDiploma(id, {
      onSuccess: () => toast.success("Diploma deleted successfully"),
      onError: () => toast.error("Failed to delete diploma"),
    });
  };
  const startItem = (metadata.page - 1) * metadata.limit + 1;
  const endItem = Math.min(metadata.page * metadata.limit, metadata.total);

  const loading = isLoading || isFetching;


  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="p-6 space-y-4">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-medium text-gray-800 text-lg">
              {startItem} – {endItem} of {metadata.total}
            </span>

            <div className="flex items-center gap-1 w-53 h-10 bg-gray-200">
              <Button
                variant="outline"
                size="icon"
                disabled={metadata.page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft />
              </Button>

              <span className="px-2">
                Page {metadata.page} of {metadata.totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                disabled={
                  metadata.page >= metadata.totalPages || loading
                }
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

      <Link href={`/add-diploma`}>

<Button className="bg-emerald-500 h-10 w-49 hover:bg-emerald-600 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add New Diploma
          </Button>
</Link>
        
        </div>

        {/*  Filters  */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <div className="bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-blue-600">
              <div className="flex items-center gap-2 text-lg font-inter  text-white">
                <SlidersHorizontal className="w-5 h-5" />
                Search &amp; Filters
              </div>

                 <CollapsibleTrigger asChild>
  <Button
    variant="null"
    size="sm"
    className="text-white font-inter  text-sm h-7 gap-1"
  >
    <ChevronsDownUp className="w-4 h-4" />
    Hide
  </Button>
</CollapsibleTrigger>
            </div>

          <CollapsibleContent>
              <div className="px-4 py-4 space-y-3">
                <div className="relative " >
                  <Input
                    placeholder="Search by title"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}

                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    className=" h-11"
                  />
                  <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200" />
                </div>

                            {/* Immutability Filter */}
<Select value={immutability} onValueChange={setImmutability}>
  <SelectTrigger className="text-md font-mono w-81  h-11  border border-input " >
    <SelectValue placeholder="Immutability"   />
    {/* <ChevronsUpDown/> */}

  </SelectTrigger>

  <SelectContent>
    <SelectItem value="none">None</SelectItem>
    <SelectItem value="immutable">Immutable</SelectItem>
    <SelectItem value="mutable">Mutable</SelectItem>
  </SelectContent>
</Select>
           {/*Button */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleClear}
                  className=" text-black  w-25 h-9 font-mono font-medium rounded-none border-none"
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gray-200 hover:bg-gray-300 text-black w-25 h-9 font-mono font-medium rounded-none"
                    onClick={handleApply}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>


                {/*  Table  */}
        <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-600 hover:bg-blue-600  h-9 font-mono">
                <TableHead className="text-white font-semibold w-20">Image</TableHead>
                <TableHead className="text-white font-semibold">Title</TableHead>
                <TableHead className="text-white font-semibold">Description</TableHead>
                <TableHead className="text-white font-semibold text-right">
                  <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-blue-700 hover:text-white gap-1 -mr-2"
                      >
                      
                        Sort
                        <ArrowDownWideNarrow className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      {SORT_OPTIONS.map((opt) => (
                        <DropdownMenuItem
                          key={opt.label}
                          onClick={() => handleSort(opt)}
                          className={
                            activeSort === opt.label
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : ""
                          }
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
                Array.from({ length: 20 }).map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(4)].map((__, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : diplomas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-gray-400">
                    No diplomas found🥲
                  </TableCell>
                </TableRow>
              ) : (
                filteredDiplomas.map((diploma, idx) => (
                  <TableRow
                    key={diploma.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    {/* Image */}
                    <TableCell>
                      <div className="w-23 h-25  overflow-hidden  flex-shrink-0">
                        {diploma.image ? (
                          <Image
                            src={diploma.image}
                            alt={diploma.title}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
                            no image
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Title */}
                    <TableCell className="font-medium font-mono text-gray-800 text-ml  w-50  whitespace-nowrap">
                    <span className="ml-8">  {diploma.title}</span>
                    </TableCell>

                    {/* Description */}
                    <TableCell className="text-gray-500 font-mono">
                      <p className="line-clamp-2">{diploma.description}</p>
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
                          {/* view */}
                          <Link href={`/admin-diplomas/${diploma.id}`}>
                           <DropdownMenuItem className="gap-2 text-gray-700">
                            <Eye className="w-4 h-4 text-blue-500" />
                            View
                          </DropdownMenuItem>
                          </Link>
                             {/* Edit */}
                             <Link href={`/admin-diplomas/${diploma.id}/edit`}>
                              <DropdownMenuItem className="gap-2 text-gray-700">
                            <Pencil className="w-4 h-4 text-green-500" />
                            Edit
                          </DropdownMenuItem>
                             </Link>
                         
                              {/* Delete */}
                           <DropdownMenuItem
    className="gap-2 text-red-600 focus:text-red-600"
    onClick={() => handleDelete(String(diploma.id))} 
    disabled={isDeleting}
  >
    <Trash2 className="w-4 h-4" />
    {isDeleting ? "Deleting..." : "Delete"}
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