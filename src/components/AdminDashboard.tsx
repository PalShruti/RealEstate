import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Download, Users, Calendar, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { bookingService } from "@/services/bookingService";

type Booking = {
  id: string;
  name: string;
  contact_number: string;
  bhk_type: string | null;
  status: string | null;
  created_at: string;
};

export const AdminDashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingService.getAllBookings,
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      bookingService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Booking Updated",
        description: "Booking status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
      console.error("Update error:", error);
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: bookingService.deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Booking Deleted",
        description: "Booking has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete booking. Please try again.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    },
  });

  const handleStatusUpdate = (id: string, status: string) => {
    updateBookingMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      deleteBookingMutation.mutate(id);
    }
  };

  const filteredBookings = bookings.filter((booking: Booking) => {
    if (selectedStatus === "all") return true;
    return booking.status === selectedStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: Booking) => b.status === 'pending').length,
    confirmed: bookings.filter((b: Booking) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b: Booking) => b.status === 'cancelled').length,
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Contact', 'BHK Type', 'Status', 'Date'],
      ...filteredBookings.map((booking: Booking) => [
        booking.name,
        booking.contact_number,
        booking.bhk_type || 'N/A',
        booking.status || 'pending',
        new Date(booking.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-blue-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Dashboard</h1>
          <p className="text-blue-700">Manage property visit bookings and track performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Cancelled</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Export */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedStatus === "all" ? "default" : "outline"}
              onClick={() => setSelectedStatus("all")}
              className={selectedStatus === "all" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200 text-blue-700 hover:bg-blue-50"}
            >
              All ({stats.total})
            </Button>
            <Button
              variant={selectedStatus === "pending" ? "default" : "outline"}
              onClick={() => setSelectedStatus("pending")}
              className={selectedStatus === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : "border-yellow-200 text-yellow-700 hover:bg-yellow-50"}
            >
              Pending ({stats.pending})
            </Button>
            <Button
              variant={selectedStatus === "confirmed" ? "default" : "outline"}
              onClick={() => setSelectedStatus("confirmed")}
              className={selectedStatus === "confirmed" ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-700 hover:bg-green-50"}
            >
              Confirmed ({stats.confirmed})
            </Button>
            <Button
              variant={selectedStatus === "cancelled" ? "default" : "outline"}
              onClick={() => setSelectedStatus("cancelled")}
              className={selectedStatus === "cancelled" ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-700 hover:bg-red-50"}
            >
              Cancelled ({stats.cancelled})
            </Button>
          </div>
          <Button
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Bookings Table */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Property Visit Bookings</CardTitle>
            <CardDescription className="text-blue-700">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-3 px-4 font-medium text-blue-800">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-blue-800">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-blue-800">BHK Type</th>
                    <th className="text-left py-3 px-4 font-medium text-blue-800">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-blue-800">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-blue-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking: Booking) => (
                    <tr key={booking.id} className="border-b border-blue-100 hover:bg-blue-50">
                      <td className="py-3 px-4 text-blue-900">{booking.name}</td>
                      <td className="py-3 px-4 text-blue-700">{booking.contact_number}</td>
                      <td className="py-3 px-4 text-blue-700">{booking.bhk_type || 'N/A'}</td>
                      <td className="py-3 px-4">{getStatusBadge(booking.status)}</td>
                      <td className="py-3 px-4 text-blue-700">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          {booking.status !== 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={updateBookingMutation.isPending}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirm
                            </Button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              className="border-red-200 text-red-700 hover:bg-red-50"
                              disabled={updateBookingMutation.isPending}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(booking.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            disabled={deleteBookingMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="text-center py-8 text-blue-600">
                  No bookings found for the selected filter.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
