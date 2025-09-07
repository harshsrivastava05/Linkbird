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
import { PlusCircle, Building, MapPin } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { LeadDetailSheet } from "@/components/leads/lead-detail-sheet";
import { DataTableSkeleton } from "@/components/skeletons/data-table-skeleton";

// Enhanced Lead type to match the sheet component
type Lead = {
  id: string;
  name: string | null;
  email: string;
  status: string;
  createdAt: string;
  title?: string;
  company?: string;
  location?: string;
  profileImage?: string;
  connectionStatus?: string;
  lastActivity?: string;
  linkedinUrl?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enrichLeadData = (lead: any): Lead => {
  // Mock data - in production you'd fetch this from LinkedIn API or your database
  const mockEnrichment = {
    title: "Regional Head",
    company: "Gynandra", 
    location: "Mumbai, Maharashtra",
    connectionStatus: "2nd",
    lastActivity: "2 days ago"
  };
  
  return {
    ...lead,
    ...mockEnrichment
  };
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
  const data = await res.json();
  
  // Enrich the leads data with additional profile information
  const enrichedLeads = data.leads.map(enrichLeadData);
  
  return {
    leads: enrichedLeads,
    nextCursor: data.nextCursor
  };
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
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

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'secondary';
      case 'contacted': return 'default'; 
      case 'responded': return 'default';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
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

      {/* Enhanced Table */}
      <div className="mt-8 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Connection</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.leads.map((lead: Lead) => (
                  <TableRow
                    key={lead.id}
                    onClick={() => handleRowClick(lead)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Profile Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {lead.name?.split(' ').map(n => n[0]).join('') || 'L'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {lead.name || 'Unknown Lead'}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {lead.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Building className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{lead.company || 'Unknown'}</span>
                      </div>
                      {lead.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{lead.location}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {lead.connectionStatus || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {lead.lastActivity || 'Never'}
                      </span>
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

      {/* Enhanced Sheet Component */}
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