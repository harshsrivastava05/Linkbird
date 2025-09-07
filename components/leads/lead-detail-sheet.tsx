"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building, 
  MessageSquare,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

// Enhanced Lead type with more profile data
type Lead = {
  id: string;
  name: string | null;
  email: string;
  status: string;
  createdAt: string;
  // Additional fields that would come from LinkedIn/lead enrichment
  title?: string;
  company?: string;
  location?: string;
  profileImage?: string;
  connectionStatus?: string;
  lastActivity?: string;
  linkedinUrl?: string;
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
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  if (!lead) return null;

  // Mock data for demonstration - in real app this would come from your database
  const mockProfileData = {
    title: "Regional Head",
    company: "Gynandra",
    location: "Mumbai, Maharashtra",
    profileImage: "/api/placeholder/80/80", // You'd store actual profile images
    connectionStatus: "2nd",
    lastActivity: "2 days ago",
    linkedinUrl: "https://linkedin.com/in/example"
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'secondary';
      case 'contacted': return 'default';
      case 'responded': return 'default';
      case 'pending approval': return 'outline';
      default: return 'secondary';
    }
  };

  const activities = [
    {
      type: 'invitation',
      title: 'Invitation Request',
      description: `Hi ${lead.name}, I'm building consultative AI...`,
      time: '2 days ago',
      status: 'sent',
      icon: MessageSquare
    },
    {
      type: 'connection',
      title: 'Connection Status',
      description: 'Check connection status',
      time: '1 day ago',
      status: 'pending',
      icon: Clock
    },
    {
      type: 'reply',
      title: 'Replied',
      description: 'View Reply',
      time: '6 hours ago',
      status: 'completed',
      icon: CheckCircle2
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        {/* Header */}
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-left">Lead Profile</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 border-b">
            <div className="flex items-start gap-4">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                  {lead.name?.split(' ').map(n => n[0]).join('') || 'L'}
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {lead.name || 'Unknown Lead'}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {mockProfileData.title}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    <span>{mockProfileData.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{mockProfileData.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(lead.status)}>
                    {lead.status === 'Pending' ? 'Pending Approval' : lead.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {mockProfileData.connectionStatus}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Profile Info */}
          <div className="border-b">
            <button
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">Additional Profile Info</span>
              {showAdditionalInfo ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            
            {showAdditionalInfo && (
              <div className="px-6 pb-4 space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 text-gray-900">{lead.email}</span>
                </div>
                <div>
                  <span className="text-gray-500">Added:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Last Activity:</span>
                  <span className="ml-2 text-gray-900">{mockProfileData.lastActivity}</span>
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="flex-1 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex gap-3">
                    {/* Timeline indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : activity.status === 'sent'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-px h-6 bg-gray-200 mt-2" />
                      )}
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </h5>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                        {activity.type === 'invitation' && (
                          <button className="text-blue-600 hover:text-blue-700 ml-1">
                            See More
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t p-4 flex gap-2">
            <Button className="flex-1" size="sm">
              Send Message
            </Button>
            <Button variant="outline" size="sm">
              Add Note
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}