"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/skeletons/data-table-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { deleteCampaign, toggleCampaignStatus } from "@/actions/campaigns";
import { toast } from "sonner";

type Campaign = {
  id: string;
  name: string;
  status: string;
  progress: number;
  createdAt: string;
};

async function getCampaigns(): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns");
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const {
    data: campaigns,
    isLoading,
    error,
  } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: getCampaigns,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      toast.success("Campaign deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (variables: { id: string; status: string }) =>
      toggleCampaignStatus(variables.id, variables.status),
    onSuccess: () => {
      toast.success("Campaign status updated!");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error) => toast.error(error.message),
  });

  // Filter campaigns based on the active tab and search term
  const filteredCampaigns = campaigns?.filter((campaign) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Active" && campaign.status === "Active") ||
      (activeTab === "Inactive" && campaign.status !== "Active");
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        
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

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-md bg-muted p-1">
          <Button
            variant={activeTab === "All" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("All")}
          >
            All Campaigns
          </Button>
          <Button
            variant={activeTab === "Active" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("Active")}
          >
            Active
          </Button>
          <Button
            variant={activeTab === "Inactive" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("Inactive")}
          >
            Inactive
          </Button>
        </div>
        <Input
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns?.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      campaign.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={campaign.progress} className="w-32" />
                    <span>{campaign.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: campaign.id,
                            status: campaign.status,
                          })
                        }
                      >
                        {campaign.status === "Active" ? "Pause" : "Resume"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => deleteMutation.mutate(campaign.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
