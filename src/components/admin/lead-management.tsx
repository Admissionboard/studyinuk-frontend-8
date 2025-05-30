import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Filter,
  Mail, 
  MessageCircle,
  Phone, 
  Eye,
  UserPlus,
  Upload
} from "@/lib/icons";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lead, InsertLead } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function LeadManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Fetch leads with filters
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/admin/leads", searchTerm, statusFilter, sourceFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);
      
      const url = `/api/admin/leads${params.toString() ? '?' + params.toString() : ''}`;
      return fetch(url, { credentials: "include" }).then(res => res.json());
    },
  });

  // Send invitation email mutation
  const sendInvitationMutation = useMutation({
    mutationFn: (leadId: number) => apiRequest("POST", `/api/admin/leads/${leadId}/invite`),
    onSuccess: () => {
      toast({ title: "Invitation sent successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    },
  });

  // Send WhatsApp message mutation
  const sendWhatsAppMutation = useMutation({
    mutationFn: (leadId: number) => apiRequest("POST", `/api/admin/leads/${leadId}/whatsapp`),
    onSuccess: () => {
      toast({ title: "WhatsApp message sent successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    },
  });

  // Update lead status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: number; status: string }) => 
      apiRequest("PATCH", `/api/admin/leads/${leadId}`, { status }),
    onSuccess: () => {
      toast({ title: "Lead status updated!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    },
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'interested': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'google': return 'bg-red-100 text-red-800';
      case 'reference': return 'bg-green-100 text-green-800';
      case 'website': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-600">Manage leads from Facebook, Google, and referrals</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Leads
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Import Leads</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>CSV File</Label>
                  <Input type="file" accept=".csv" className="mt-1" />
                </div>
                <div className="text-sm text-gray-600">
                  <p>CSV should include: firstName, lastName, email, phone, source</p>
                  <p>Supported sources: facebook, google, reference, website</p>
                </div>
                <Button className="w-full">Import Leads</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <CreateLeadForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="website">Website</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No leads found</p>
              <p className="text-sm text-gray-400">Import or add leads to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </h3>
                        <Badge className={getStatusBadgeColor(lead.status || 'new')}>
                          {lead.status}
                        </Badge>
                        <Badge variant="outline" className={getSourceBadgeColor(lead.source)}>
                          {lead.source}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>📧 {lead.email}</div>
                        {lead.phone && <div>📱 {lead.phone}</div>}
                        <div>📅 {formatDistanceToNow(new Date(lead.createdAt!), { addSuffix: true })}</div>
                      </div>
                      
                      {lead.notes && (
                        <p className="text-sm text-gray-500 mt-2">{lead.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendInvitationMutation.mutate(lead.id)}
                        disabled={sendInvitationMutation.isPending}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      
                      {lead.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendWhatsAppMutation.mutate(lead.id)}
                          disabled={sendWhatsAppMutation.isPending}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}

                      <Select
                        value={lead.status || 'new'}
                        onValueChange={(status) => updateStatusMutation.mutate({ leadId: lead.id, status })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="interested">Interested</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

// Create Lead Form Component
function CreateLeadForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    source: 'website',
    notes: '',
    referredBy: ''
  });

  const createLeadMutation = useMutation({
    mutationFn: (data: InsertLead) => apiRequest("POST", "/api/admin/leads", data),
    onSuccess: () => {
      toast({ title: "Lead created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeadMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <Label>Source</Label>
        <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="reference">Reference</SelectItem>
            <SelectItem value="website">Website</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.source === 'reference' && (
        <div>
          <Label>Referred By</Label>
          <Input
            value={formData.referredBy}
            onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
          />
        </div>
      )}

      <div>
        <Label>Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={createLeadMutation.isPending}>
          {createLeadMutation.isPending ? "Creating..." : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}

// Lead Detail Modal Component
function LeadDetailModal({ lead, isOpen, onClose }: { lead: Lead; isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lead.firstName} {lead.lastName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Email</Label>
              <p className="text-sm">{lead.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Phone</Label>
              <p className="text-sm">{lead.phone || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Source</Label>
              <Badge variant="outline" className={getSourceBadgeColor(lead.source)}>
                {lead.source}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <Badge className={getStatusBadgeColor(lead.status || 'new')}>
                {lead.status}
              </Badge>
            </div>
          </div>

          {lead.notes && (
            <div>
              <Label className="text-sm font-medium text-gray-500">Notes</Label>
              <p className="text-sm bg-gray-50 p-3 rounded">{lead.notes}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getSourceBadgeColor(source: string) {
  switch (source) {
    case 'facebook': return 'bg-blue-100 text-blue-800';
    case 'google': return 'bg-red-100 text-red-800';
    case 'reference': return 'bg-green-100 text-green-800';
    case 'website': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'contacted': return 'bg-yellow-100 text-yellow-800';
    case 'interested': return 'bg-green-100 text-green-800';
    case 'converted': return 'bg-purple-100 text-purple-800';
    case 'closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}