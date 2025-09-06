// components/leads/lead-detail-sheet.tsx
"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Use the same Lead type from the main page
type Lead = {
  id: string;
  name: string | null;
  email: string;
  status: string;
  createdAt: string;
};

type LeadDetailSheetProps = {
  lead: Lead | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function LeadDetailSheet({
  lead,
  isOpen,
  onOpenChange,
}: LeadDetailSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{lead?.name ?? "Lead Profile"}</SheetTitle>
          <SheetDescription>
            Detailed information about the lead.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8">
          <p>
            <strong>Email:</strong> {lead?.email}
          </p>
          <p>
            <strong>Status:</strong> {lead?.status}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {lead && new Date(lead.createdAt).toLocaleString()}
          </p>
          {/* Add more lead details here as needed */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
