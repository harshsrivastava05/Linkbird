// app/(dashboard)/leads/page.tsx
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { LeadDetailSheet } from "@/components/leads/lead-detail-sheet";
import { DataTableSkeleton } from "@/components/skeletons/data-table-skeleton";

// A type definition for our lead data
type Lead = {
  id: string;
  name: string | null;
  email: string;
  status: string;
  createdAt: string;
};

// Fetch leads with search & pagination
const fetchLeads = async ({
  pageParam,
  searchTerm,
}: {
  pageParam: string | null;
  searchTerm: string;
}) => {
  const url = new URL("/api/leads", window.location.origin);
  if (pageParam) url.searchParams.set("cursor", pageParam);
  if (searchTerm) url.searchParams.set("search", searchTerm);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch leads");
  }
  return res.json();
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search input
  const { ref, inView } = useInView();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["leads", debouncedSearchTerm],
    queryFn: ({ pageParam }) =>
      fetchLeads({ pageParam, searchTerm: debouncedSearchTerm }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* You can also create skeletons for the header if you like */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">
              Manage your campaigns and track their performance.
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
        <DataTableSkeleton columns={5} />
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Manage all your leads across campaigns.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Lead
        </Button>
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="mt-8 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.leads.map((lead: Lead) => (
                  <TableRow
                    key={lead.id}
                    onClick={() => handleRowClick(lead)}
                    className="cursor-pointer" // Make it look clickable
                  >
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>
                      <Badge>{lead.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
            <TableRow ref={ref} /> {/* Observer target */}
          </TableBody>
        </Table>
      </div>

      {isFetchingNextPage && (
        <div className="py-4 text-center">Loading more...</div>
      )}
      {!hasNextPage && (
        <div className="py-4 text-center text-muted-foreground">
          No more leads to load.
        </div>
      )}
      {/* Add the Sheet component to the page */}
      <LeadDetailSheet
        lead={selectedLead}
        isOpen={!!selectedLead}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedLead(null);
          }
        }}
      />
    </div>
  );
}
